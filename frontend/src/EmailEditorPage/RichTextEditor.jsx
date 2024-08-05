// Import React dependencies.
import React, { useMemo, useCallback } from "react";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import {
	createEditor,
	Editor,
	Transforms,
	Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import { Toolbar, Button, Icon } from "./components";
// this allows us to be cross compatibile by handling different activation keys such as ctrl and command automatically
import isHotkey from "is-hotkey";

import { Image, withImages, InsertImageButton } from "./image";

// hotkeys and their corresponding formatting transformations
const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+u": "underline",
	"mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

// toggle a mark on or off, marks are formatting things such as bold, italics, strikethrough, etc
const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

// Check if the given mark is active
const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

const initValue = [
	{
		type: "paragraph",
		children: [{ text: "A line of text in a paragraph." }],
	},
];

const RichTextEditor = () => {
	const renderElement = useCallback((props) => <Element {...props} />, []);

	const renderLeaf = useCallback((props) => {
		return <Leaf {...props} />;
	}, []);
	const editor = useMemo(
		() => withImages(withHistory(withReact(createEditor()))),
		[],
	);
	return (
		<Slate editor={editor} initialValue={initValue}>
			<Toolbar>
				<MarkButton format="bold" icon="format_bold" />
				<MarkButton format="italic" icon="format_italic" />
				<MarkButton format="underline" icon="format_underlined" />
				<MarkButton format="code" icon="code" />
				<BlockButton format="heading-one" icon="looks_one" />
				<BlockButton format="heading-two" icon="looks_two" />
				<BlockButton format="block-quote" icon="format_quote" />
				<BlockButton format="numbered-list" icon="format_list_numbered" />
				<BlockButton format="bulleted-list" icon="format_list_bulleted" />
				<InsertImageButton />
				<BlockButton format="left" icon="format_align_left" />
				<BlockButton format="center" icon="format_align_center" />
				<BlockButton format="right" icon="format_align_right" />
				<BlockButton format="justify" icon="format_align_justify" />
			</Toolbar>
			<Editable
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				// this is what happens when u push a key
				onKeyDown={(event) => {
					if (!event.ctrlKey) return;

					// check all hotkeys
					for (const hotkey in HOTKEYS) {
						if (isHotkey(hotkey, event)) {
							event.preventDefault();
							const mark = HOTKEYS[hotkey];
							toggleMark(editor, mark);
						}
					}

					// switch (event.key) {
					// 	case "`": {
					// 		event.preventDefault();
					// 		const [match] = Editor.nodes(editor, {
					// 			match: (n) => n.type === "code",
					// 		});
					// 		Transforms.setNodes(
					// 			editor,
					// 			{ type: match ? "paragraph" : "code" },
					// 			{
					// 				match: (n) =>
					// 					Element.isElement(n) && Editor.isBlock(editor, n),
					// 			},
					// 		);
					// 		break;
					// 	}
					// }
				}}
			/>
		</Slate>
	);
};

const CodeElement = (props) => {
	return (
		<pre {...props.attributes}>
			<code>{props.children}</code>
		</pre>
	);
};

const DefaultElement = (props) => {
	return <p {...props.attributes}>{props.children}</p>;
};

// Define a React component to render leaves with  text.
const Leaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}

	if (leaf.code) {
		children = <code>{children}</code>;
	}

	if (leaf.italic) {
		children = <em>{children}</em>;
	}

	if (leaf.underline) {
		children = <u>{children}</u>;
	}

	return <span {...attributes}>{children}</span>;

	// we can't do something like below with <span style=...> as slate is buggy
	// https://github.com/ianstormtaylor/slate/issues/3309
	// return (
	// 	<span
	// 		{...attributes}
	// 		style={{
	// 			fontWeight: leaf.bold ? "" : "normal",
	// 			fontStyle: leaf.italic ? "italic" : "",
	// 			textDecoration: "",
	// 		}}
	// 	>
	// 		{children}
	// 	</span>
	// );
};

// Much of the below code is taken/adapted from https://github.com/ianstormtaylor/slate/blob/main/site/examples/richtext.tsx

const Element = ({ attributes, children, element }) => {
	const style = { textAlign: element.align };
	const props = { attributes, children, element };
	switch (element.type) {
		case "block-quote":
			return (
				<blockquote style={style} {...attributes}>
					{children}
				</blockquote>
			);
		case "bulleted-list":
			return (
				<ul style={style} {...attributes}>
					{children}
				</ul>
			);
		case "heading-one":
			return (
				<h1 style={style} {...attributes}>
					{children}
				</h1>
			);
		case "heading-two":
			return (
				<h2 style={style} {...attributes}>
					{children}
				</h2>
			);
		case "list-item":
			return (
				<li style={style} {...attributes}>
					{children}
				</li>
			);
		case "numbered-list":
			return (
				<ol style={style} {...attributes}>
					{children}
				</ol>
			);
		case "image":
			return <Image {...props} />;
		default:
			return (
				<p style={style} {...attributes}>
					{children}
				</p>
			);
	}
};

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(
		editor,
		format,
		TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
	);
	const isList = LIST_TYPES.includes(format);

	Transforms.unwrapNodes(editor, {
		match: (n) =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			LIST_TYPES.includes(n.type) &&
			!TEXT_ALIGN_TYPES.includes(format),
		split: true,
	});
	let newProperties;
	if (TEXT_ALIGN_TYPES.includes(format)) {
		newProperties = {
			align: isActive ? undefined : format,
		};
	} else {
		newProperties = {
			type: isActive ? "paragraph" : isList ? "list-item" : format,
		};
	}
	Transforms.setNodes(editor, newProperties);

	if (!isActive && isList) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};
const isBlockActive = (editor, format, blockType = "type") => {
	const { selection } = editor;
	if (!selection) return false;

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n) =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				n[blockType] === format,
		}),
	);

	return !!match;
};
const BlockButton = ({ format, icon }) => {
	const editor = useSlate();
	return (
		<Button
			active={isBlockActive(
				editor,
				format,
				TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
			)}
			onMouseDown={(event) => {
				event.preventDefault();
				toggleBlock(editor, format);
			}}
		>
			<Icon>{icon}</Icon>
		</Button>
	);
};

const MarkButton = ({ format, icon }) => {
	const editor = useSlate();
	return (
		<Button
			active={isMarkActive(editor, format)}
			onMouseDown={(event) => {
				event.preventDefault();
				toggleMark(editor, format);
			}}
		>
			<Icon>{icon}</Icon>
		</Button>
	);
};

export default RichTextEditor;
