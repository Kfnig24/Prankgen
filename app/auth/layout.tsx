interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <main className="flex flex-col lg:grid lg:grid-cols-2 w-full h-full">
            <div className="hidden lg:flex lg:bg-gradient-to-bl lg:from-orange-500 lg:to-yellow-500 p-4 lg:flex-col gap-1">
                <span className="text-xl font-bold text-white">
                    Prankgen
                </span>
                <p className="text-white opacity-80 text-xs pl-2">
                    Prank your friends !
                </p>
            </div>
            <div className="p-4 w-full h-screen flex justify-center items-center">
                <span className="absolute top-4 left-4 font-bold lg:hidden">
                    Prankgen
                </span>
                {children}
            </div>
        </main>
    )
}

export default AuthLayout