import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.56904 35.889L27.3808 19.5641L32 15.7579L31.9886 0L0 26.3577L7.56904 35.889Z"/>
            <path d="M14.6136 44.7606L23.7235 37.2539L27.3808 34.2402V19.5641L7.56904 35.889L14.6136 44.7606Z" fill-opacity="0.8"/>
            <path d="M20.3644 52L23.7235 49.2318V37.2539L14.6136 44.7606L20.3644 52Z" fill-opacity="0.6"/>
        </svg>
    );
}
