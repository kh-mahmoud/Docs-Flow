import CursorSVG from "@/public/assets/CursorSVG"



type Props = {
    color: string
    x: string
    y: string
}



const Cursor = ({ color, x, y }: Props) => {
    return (
        <div
            className={`pointer-events-none  absolute top-0 left-0`}
            style={{ transform: `translateX(${x}px) translateY(${y}px)` }}>
            <CursorSVG color={color} />


        </div>
    );
}

export default Cursor;
