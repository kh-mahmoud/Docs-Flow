import Cursor from "./Cursor";



type LiveCursorProps = {
    others: any;
};



const LiveCursors = ({ others }: LiveCursorProps) => {
    //create cursor for each user
    return (
        <div>
            {
                others.map((other:any) => {
                    if (!other.presence.cursor) return null;
                    if (!other.info) return null;

                    return (
                        <Cursor
                            key={`cursor-${other.connectionId}`}
                            color={other.info.color}
                            x={other.presence.cursor?.x}
                            y={other.presence.cursor?.y}
                        />
                    );
                })
            }
        </div>
    );
}

export default LiveCursors;
