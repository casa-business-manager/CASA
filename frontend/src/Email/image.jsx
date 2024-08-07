import {
	useSelected,
	useFocused,
	useSlateStatic,
	ReactEditor,
} from "slate-react";
import { Transforms } from "slate";

import { css } from "@emotion/css";
import { Button, Icon } from "./components";

import imageExtensions from "image-extensions";
import isUrl from "is-url";
// code taken and modified from https://github.com/ianstormtaylor/slate/blob/main/site/examples/images.tsx
// todo: convert to tsx
export const withImages = (editor) => {
	const { insertData, isVoid } = editor;

	editor.isVoid = (element) => {
		return element.type === "image" ? true : isVoid(element);
	};

	editor.insertData = (data) => {
		const text = data.getData("text/plain");
		const { files } = data;

		if (files && files.length > 0) {
			for (const file of files) {
				const reader = new FileReader();
				const [mime] = file.type.split("/");

				if (mime === "image") {
					reader.addEventListener("load", () => {
						const url = reader.result;
						insertImage(editor, url);
					});

					reader.readAsDataURL(file);
				}
			}
		} else if (isImageUrl(text)) {
			insertImage(editor, text);
		} else {
			insertData(data);
		}
	};

	return editor;
};

export const insertImage = (editor, url) => {
	const text = { text: "" };
	const image = { type: "image", url, children: [text] };
	Transforms.insertNodes(editor, image);
	Transforms.insertNodes(editor, {
		type: "paragraph",
		children: [{ text: "" }],
	});
};

export const InsertImageButton = () => {
	const editor = useSlateStatic();
	return (
		<Button
			onMouseDown={(event) => {
				event.preventDefault();
				const url = window.prompt("Enter the URL of the image:");
				if (url && !isImageUrl(url)) {
					alert("URL is not an image");
					return;
				}
				url && insertImage(editor, url);
			}}
		>
			<Icon>image</Icon>
		</Button>
	);
};

export const isImageUrl = (url) => {
	if (!url) return false;
	if (!isUrl(url)) return false;
	const ext = new URL(url).pathname.split(".").pop();
	return imageExtensions.includes(ext);
};
export const Image = ({ attributes, children, element }) => {
	const editor = useSlateStatic();
	const path = ReactEditor.findPath(editor, element);

	const selected = useSelected();
	const focused = useFocused();
	return (
		<div {...attributes}>
			{children}
			<div
				contentEditable={false}
				className={css`
					position: relative;
				`}
			>
				<img
					src={element.url}
					className={css`
						display: block;
						max-width: 100%;
						max-height: 20em;
						box-shadow: ${selected && focused ? "0 0 0 3px #B4D5FF" : "none"};
					`}
				/>
				<Button
					active
					onClick={() => Transforms.removeNodes(editor, { at: path })}
					className={css`
						display: ${selected && focused ? "inline" : "none"};
						position: absolute;
						top: 0.5em;
						left: 0.5em;
						background-color: white;
					`}
				>
					<Icon>delete</Icon>
				</Button>
			</div>
		</div>
	);
};
