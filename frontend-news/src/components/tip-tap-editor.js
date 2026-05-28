// 'use client';

// import React, { useEffect } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';

// import {
//   MdFormatBold,
//   MdFormatItalic,
//   MdFormatUnderlined,
//   MdFormatListBulleted,
//   MdFormatListNumbered,
//   MdFormatQuote,
//   MdCode
// } from 'react-icons/md';
// import { AiOutlineStrikethrough } from 'react-icons/ai';
// import { TbH2 } from 'react-icons/tb';

// export default function TiptapEditor({ value, onChange }) {
//   const editor = useEditor({
//     immediatelyRender: true,
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: 'Description'
//       })
//     ],
//     content: value,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     }
//   });

//   useEffect(() => {
//     if (editor && value !== editor.getHTML()) {
//       editor.commands.setContent(value);
//     }
//   }, [value, editor]);

//   const renderButton = (label, Icon, isActive, onClick) => (
//     <Tooltip title={label} key={label}>
//       <IconButton onClick={onClick} color={isActive ? 'primary' : 'default'} size="small">
//         <Icon size={18} />
//       </IconButton>
//     </Tooltip>
//   );

//   return (
//     <Box
//       sx={{
//         '& .ProseMirror': {
//           border: (theme) => `1px solid ${theme.palette.divider}`,
//           borderRadius: '0 0 8px 8px',
//           padding: 2,
//           minHeight: 320,
//           overflow: 'auto',
//           outline: 'none',
//           transition: 'border-color 0.3s',
//           '&:hover, &:focus-within': {
//             borderColor: (theme) => theme.palette.primary.main
//           }
//         },
//         '& .tiptap-toolbar': {
//           border: (theme) => `1px solid ${theme.palette.divider}`,
//           borderBottom: 'none',
//           borderRadius: '8px 8px 0 0',
//           padding: 1
//         }
//       }}
//     >
//       <Box className="tiptap-toolbar">
//         {editor && (
//           <>
//             {renderButton('Bold', MdFormatBold, editor.isActive('bold'), () =>
//               editor.chain().focus().toggleBold().run()
//             )}
//             {renderButton('Italic', MdFormatItalic, editor.isActive('italic'), () =>
//               editor.chain().focus().toggleItalic().run()
//             )}
//             {renderButton('Underline', MdFormatUnderlined, editor.isActive('underline'), () =>
//               editor.chain().focus().toggleUnderline().run()
//             )}
//             {renderButton('Strikethrough', AiOutlineStrikethrough, editor.isActive('strike'), () =>
//               editor.chain().focus().toggleStrike().run()
//             )}
//             {renderButton('Bullet List', MdFormatListBulleted, editor.isActive('bulletList'), () =>
//               editor.chain().focus().toggleBulletList().run()
//             )}
//             {renderButton('Numbered List', MdFormatListNumbered, editor.isActive('orderedList'), () =>
//               editor.chain().focus().toggleOrderedList().run()
//             )}
//             {renderButton('Block Quote', MdFormatQuote, editor.isActive('blockquote'), () =>
//               editor.chain().focus().toggleBlockquote().run()
//             )}
//             {renderButton('Code Block', MdCode, editor.isActive('codeBlock'), () =>
//               editor.chain().focus().toggleCodeBlock().run()
//             )}
//             {renderButton('Heading', TbH2, editor.isActive('heading', { level: 2 }), () =>
//               editor.chain().focus().toggleHeading({ level: 2 }).run()
//             )}
//           </>
//         )}
//       </Box>

//       <EditorContent editor={editor} />
//     </Box>
//   );
// }


'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdCode
} from 'react-icons/md';
import { AiOutlineStrikethrough } from 'react-icons/ai';
import { TbH2 } from 'react-icons/tb';

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit,
      Underline,                         
      Placeholder.configure({
        placeholder: 'Description'
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          style: 'width: 100%; border-collapse: collapse; margin-bottom: 10px;'
        }
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          style: 'background-color: #f5a623; color: #ffffff; padding: 10px 14px; text-align: left; font-size: 14px;'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          style: 'padding: 8px 14px; font-size: 14px; border-bottom: 1px solid #e0e0e0; color: #333;'
        }
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const renderButton = (label, Icon, isActive, onClick) => (
    <Tooltip title={label} key={label}>
      <IconButton onClick={onClick} color={isActive ? 'primary' : 'default'} size="small">
        <Icon size={18} />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        '& .ProseMirror': {
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: '0 0 8px 8px',
          padding: 2,
          minHeight: 320,
          overflow: 'auto',
          outline: 'none',
          transition: 'border-color 0.3s',
          '&:hover, &:focus-within': {
            borderColor: (theme) => theme.palette.primary.main
          },
          // ✅ Table styles — editor ke andar dikhne ke liye
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '10px',
          },
          '& th': {
            backgroundColor: '#f5a623',
            color: '#ffffff',
            padding: '10px 14px',
            textAlign: 'left',
            fontSize: '14px',
          },
          '& td': {
            padding: '8px 14px',
            fontSize: '14px',
            borderBottom: '1px solid #e0e0e0',
            color: '#333',
          },
          '& tr:nth-of-type(even) td': {
            backgroundColor: '#fdf6ec',
          },
          '& h2': {
            backgroundColor: '#b5451b',
            color: '#ffffff',
            padding: '10px 15px',
            margin: '20px 0 0 0',
            fontSize: '16px',
            borderRadius: '4px 4px 0 0',
          },
        },
        '& .tiptap-toolbar': {
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
          padding: 1
        }
      }}
    >
      <Box className="tiptap-toolbar">
        {editor && (
          <>
            {renderButton('Bold', MdFormatBold, editor.isActive('bold'), () =>
              editor.chain().focus().toggleBold().run()
            )}
            {renderButton('Italic', MdFormatItalic, editor.isActive('italic'), () =>
              editor.chain().focus().toggleItalic().run()
            )}
            {renderButton('Underline', MdFormatUnderlined, editor.isActive('underline'), () =>
              editor.chain().focus().toggleUnderline().run()
            )}
            {renderButton('Strikethrough', AiOutlineStrikethrough, editor.isActive('strike'), () =>
              editor.chain().focus().toggleStrike().run()
            )}
            {renderButton('Bullet List', MdFormatListBulleted, editor.isActive('bulletList'), () =>
              editor.chain().focus().toggleBulletList().run()
            )}
            {renderButton('Numbered List', MdFormatListNumbered, editor.isActive('orderedList'), () =>
              editor.chain().focus().toggleOrderedList().run()
            )}
            {renderButton('Block Quote', MdFormatQuote, editor.isActive('blockquote'), () =>
              editor.chain().focus().toggleBlockquote().run()
            )}
            {renderButton('Code Block', MdCode, editor.isActive('codeBlock'), () =>
              editor.chain().focus().toggleCodeBlock().run()
            )}
            {renderButton('Heading', TbH2, editor.isActive('heading', { level: 2 }), () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            )}
          </>
        )}
      </Box>

      <EditorContent editor={editor} />
    </Box>
  );
}