// Import React dependencies.
import React, { useState, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Editor, Transforms, Element } from "slate";

const initValue = [
	{
		type: "paragraph",
		children: [{ text: "A line of text in a paragraph." }],
	},
];

const EmailEditorPage = () => {
	const [editor] = useState(() => withReact(createEditor()));

	const renderElement = useCallback((props) => {
		switch (props.element.type) {
			case "code":
				return <CodeElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	const renderLeaf = useCallback((props) => {
		return <Leaf {...props} />;
	}, []);

	const isMarkActive = (editor, format) => {
		const marks = Editor.marks(editor);
		return marks ? marks[format] === true : false;
	};

	return (
		<Slate editor={editor} initialValue={initValue}>
			<Editable
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				// this is what happens when u push a key
				onKeyDown={(event) => {
					if (!event.ctrlKey) return;

					switch (event.key) {
						case "`": {
							event.preventDefault();
							const [match] = Editor.nodes(editor, {
								match: (n) => n.type === "code",
							});
							Transforms.setNodes(
								editor,
								{ type: match ? "paragraph" : "code" },
								{
									match: (n) =>
										Element.isElement(n) && Editor.isBlock(editor, n),
								},
							);
							break;
						}

						case "b": {
							event.preventDefault();
							const isBold = isMarkActive(editor, "bold");
							Editor.addMark(editor, "bold", !isBold);
							break;
						}
					}
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

// Define a React component to render leaves with bold text.
const Leaf = (props) => {
	return (
		<span
			{...props.attributes}
			style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
		>
			{props.children}
		</span>
	);
};

export default EmailEditorPage;
