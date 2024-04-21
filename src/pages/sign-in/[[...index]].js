import Image from "next/image";
import { Inter } from "next/font/google";
import { SignIn } from '@clerk/nextjs'
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const inter = Inter({ subsets: ["latin"] });

export default function Home( ) {

    return (
        <>

            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row">
                    <div className="text-center lg:text-left mb-8 lg:mb-0">
                
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>

                        <h1 className="ml-2 text-4xl w-full font-bold"> Comcast <span className="text-primary">Inquire</span></h1>
                    </div>
                        <p className="py-6">An AI support agent for Comcast customers powered by OpenAI.</p>
                    </div>
                    <div className="md:ml-4 lg:ml-10 card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-8 lg:mt-0">
                   
                            <SignIn  appearance={{
                                baseTheme: dark
                            }} />
                    </div>

                </div>
            </div>
        </>
    );
}
