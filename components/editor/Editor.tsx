'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React, { useCallback } from 'react';
import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from "@liveblocks/react-lexical"
import { UserType } from '@/types';
import Loader from '../Loader';
import FloatingToolbar from './plugins/FloatingToolbar';
import Comments from '../Comments';
import { useMyPresence, useOthers, useThreads } from '@liveblocks/react/suspense';
import { DeleteModal } from '../DeleteModal';
import LiveCursors from '../LiveCursor';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

function Editor({ roomId, currentUserType }: { roomId: string, currentUserType: UserType }) {


  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === "editor"
  });


  const status = useEditorStatus();
  const { threads } = useThreads();
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence();
  console.log(others)



  //track cursor movments in the live board
  const handlePointerMove = useCallback((event: React.PointerEvent) => {

      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({
        cursor: {
          x: Math.round(x),
          y: Math.round(y),
        },
      });
  }, [updateMyPresence, cursor]);

  //stop the track out the editor
  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);


  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className="editor-container size-full"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >

        <div className='toolbar-wrapper flex min-w-full justify-between'>
          <ToolbarPlugin />
          {currentUserType === "editor" && <DeleteModal roomId={roomId} />}
        </div>

        <div className='editor-wrapper flex flex-col items-center justify-start'>
          {status === "not-loaded" || status === "loading" ? <div className='h-screen text-white w-full flex justify-center items-center'><Loader /></div> : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType == 'editor' && <FloatingToolbar />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>

          )}

          <LiveblocksPlugin>
            <FloatingComposer />
            <FloatingThreads threads={threads} />
            <Comments />
          </LiveblocksPlugin>
        </div>

        <LiveCursors others={others} />

      </div>
    </LexicalComposer>
  );
}

export default Editor
