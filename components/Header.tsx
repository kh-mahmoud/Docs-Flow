import { cn } from "@/lib/utils";
import { HeaderProps } from "@/types";
import Image from "next/image";
import Link from "next/link";


const Header = ({children,className}:HeaderProps) => {
    return (
        <div className={cn("header",className)}>
            <Link href={"/"}  >
                <Image
                    src={"/assets/icons/logo.svg"}
                    alt="logo"
                    height={32}
                    width={120}
                    className="hidden md:block"
                />

                <Image
                    src={"/assets/icons/logo-icon.svg"}
                    alt="logo"
                    height={32}
                    width={120}
                    className="mr-2 md:hidden"
                />
            </Link>
            
            {children}
        </div>
    );
}

export default Header;
