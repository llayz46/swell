import AppLogoIcon from './app-logo-icon';

export default function Logo() {
    return (
        <div className="flex items-center gap-2 group">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground group-hover:invert transition duration-300">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="hidden lg:block ml-1 grid flex-1 text-left text-2xl">
                <span className="mb-0.5 leading-tight font-semibold">LAYZESPORT</span>
            </div>
        </div>
    );
}
