import { BaseUserMeta, User } from "@liveblocks/client";
import Cursor from "./Cursor";



type Presence = any;

type LiveCursorProps = {
    others: readonly User<Presence, BaseUserMeta>[];
};



const LiveCursors = ({ others }: LiveCursorProps) => {
    //create cursor for each user
    return (
        <div>
            {
                others.map((other) => {
                    if (!other.presence.cursor ) return null;
                    if (!other.info) return null;
           
                    return (
                        <Cursor
                            key={`cursor-${other.connectionId}`}
                            color={other.info.color }
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
