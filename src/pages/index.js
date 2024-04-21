import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';

// Custom hook for the typewriter effect
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');


  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prevText => prevText + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayText;
};

const Message = ({ text }) => {
  const typedText = useTypewriter(text, 50);  
  return <p>{typedText}</p>;
};

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };


  let context = "Blank";

  

  useEffect(() => {
    if (!user) {
      router.push(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  const handleServiceClick = (id) => {
  setSelectedServices(prev => {
    if (prev.includes(id)) {
      return prev.filter(serviceId => serviceId !== id); // Remove id if already selected
    } else {
      return [...prev, id]; // Add id if not selected
    }
  });
};


  const sendMessage = (content) => {
    const newMessage = {
      content,
      time: new Date().toLocaleTimeString(),
      type: 'sent'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    

  fetch('/api/gpt-respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: content, user })
  })
  .then(response => response.json())
  .then(data => {
    receiveMessage(data.response);
  })
  .catch(error => { 
    console.error('Error:', error);
  });
  };

  const receiveMessage = (content) => {
    const newMessage = {
      content,
      time: new Date().toLocaleTimeString(),
      type: 'received'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);

 
  };

  if (!user) {
    return null;
  }



  const renderMessageContent = (content) => {
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    let links = [];
    let text = content.replace(markdownLinkRegex, (match, label, url) => {
      links.push(`
        <div>
          <a href="${url}" target="_blank" class="underline text-blue-500"  rel="noopener noreferrer">${label}</a>
          <div class="mb-1">
          <button class="mt-4 btn btn-primary" onclick="window.open('${url}', '_blank')" class=""><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        View Support Link</button>
        </div>
      `);
      return ''; // Remove the link from the original position
    });
  
    // Append links and buttons at the end of the text
    return text + links.join('');
  };

  return (
    <div className="dashboard max-w-7xl mx-auto">
      <Navbar user={user} />

      {showOptions &&
        <div className='mx-auto px-10 '>
          <h1 className='text-4xl'>Hello, <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500'>{user.firstName}</span>.</h1>
          <p className='text-2xl'>Get lightning fast support with our our AI assistant.</p>

          <div className=' grid grid-cols-4 mt-4 gap-x-4'>

            <div className=" card  bg-base-300 shadow-xl hover:shadow-2xl hover:cursor-pointer " onClick={() => {
              //Added this name now it shows user name
              receiveMessage(`Hello, ${user.firstName} how can I help you today?`);
              sendMessage("Hello, I need some help with product support.");
setShowChat(true);
              setShowOptions(false);
            }}>
              <div className="card-body">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-auto text-center w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288" />
                </svg>

                <h2 className="card-title text-center mx-auto">Product Support</h2>
              </div>
            </div>

            <div className="card  bg-base-300 shadow-xl hover:shadow-2xl hover:cursor-pointer " onClick={() => {
              receiveMessage(`Hello, ${user.firstName} how can I assist you today?`);
              sendMessage("Hello, I'd like to learn about some of Comcast's products.");

setShowChat(true);
              setShowOptions(false);
              context = "Product";
            }}>
              <div className="card-body">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-auto text-center w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                </svg>

                <h2 className="card-title text-center mx-auto">Discover our products</h2>
              </div>
            </div>

            <div className="card  bg-base-300 shadow-xl hover:shadow-2xl hover:cursor-pointer " onClick={() => {
              receiveMessage(`Hello, ${user.firstName} how can I support you today?`);
              sendMessage("Hello, I'd like to make some changes to my Comcast account.");
setShowChat(true);
              setShowOptions(false);
              context = "Account";
            }}>
              <div className="card-body">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-auto text-center w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

                <h2 className="card-title text-center mx-auto">Update your account</h2>
              </div>
            </div>

          </div>


          <div className='mt-10'>
            
            <div>

              <div className='flex'>
              <h1 className="text-3xl mb-4">Your Products</h1>
              <div className='ml-auto'>
              <p>Choosing a product will allow for you to interact with the product in your support chats.</p>
                </div>

</div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 1, name: "Internet Service" },
                { id: 2, name: "Cable TV" },
                { id: 3, name: "Home Phone" },
                { id: 4, name: "Mobile Service" },
                { id: 5, name: "Home Security" },
                { id: 6, name: "Business Solutions" }
              ].map(service => (
                <div key={service.id} className={`card p-4  bg-base-300`} onClick={() => handleServiceClick(service.id)}>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">{service.name}</span>
                    <input type="checkbox" checked={selectedServices.includes(service.id)} className="checkbox checkbox-primary " />
                  </label>
                </div>
              </div>
              ))}
            </div>
            </div>

            </div>

          
</div>



      }
      

      {showChat &&
        <div>
          <div className="chat-messages max-h-[650px] overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`chat ${message.type === 'received' ? 'chat-start' : 'chat-end'}`}>
                {message.type === 'received' && (
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img alt="Tailwind CSS chat bubble component" 
                      //updated the logo to x
                      src="https://pbs.twimg.com/profile_images/1605324957130563584/fbNBbGhW_400x400.jpg" />
                    </div>
                  </div>
                )}
                <div className="chat-header">
                 
                  {message.type === 'received' ? 'Comcast Assistant' : 'You'}
                  <time className="text-xs opacity-50 ml-2">{message.time}</time>
                </div>
                <div className="chat-bubble">
                  {message.type === 'received' ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMessageContent(message.content) }} />
                  ) : (
                    message.content
                  )}
                </div>
                <div className="chat-footer opacity-50">
                  {message.type === 'received' ? 'Delivered' : 'Seen at ' + message.time}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />  {/* Invisible element at the end of the messages */}
          </div>

          <div className="fixed bottom-10 left-0 right-0 p-4 max-w-7xl px-5 mx-auto ">
            <div className='flex'>
              <input
                value={value}
                onChange={handleInputChange} 
                onKeyPress={(e) => { if (e.key === 'Enter') { sendMessage(value); e.preventDefault(); setValue(""); messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); } }}
                type="text"
                className="w-full bg-base-300  px-4 py-2 rounded-full mr-5"
                placeholder="Type your message here..."
              />
              <button onClick={() => { sendMessage(value); setValue(""); messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-primary rounded-full">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5 " />
  </svg>
</button>

            </div>
          </div>
        </div>
        

        


    
      }
    </div>
  );
}

