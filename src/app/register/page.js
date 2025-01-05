import UserForm from "@/components/UserForm";

export default async function UserRegisterationPage({searchParams}) {

  const {referCode}=searchParams;
    return(
        <> <main className="flex min-h-screen flex-col  bg-[url('/bg.webp')] bg-cover bg-center">
        <div className="absolute inset-0 ">
          <div className="h-full w-full bg-gradient-to-b from-storekwiltext to-secondary rounded-bl-[50px] opacity-75"></div>
        </div>
  
        <div className="flex h-30 shrink-0 items-center justify-center md:justify-start  p-6 px-20 z-10">
          <img
            src="/logowhite.png"
            alt="Parkheld-logo"
            className=" w-[120px] md:w-[120px] object-contain"
          />
        </div>
  

  
        <div className="z-10">
        <UserForm referCode={referCode}/>
        </div>
      </main>
        
        </>
    )
}