import { CSSProperties } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

export default function ContentEditableTextbox({
	html,
	onChange,
	style,
}: {
	html: string;
	onChange: (e: ContentEditableEvent) => void;
	style?: CSSProperties;
}) {
	return (
		<ContentEditable
			onKeyDown={e => e.stopPropagation()}
			style={{
				fontFamily: 'monospace',
				backgroundColor: html.trim().length > 0 ? 'transparent' : '#202020',
				...(style || {}),
			}}
			spellCheck={false}
			placeholder='...'
			html={html}
			onChange={onChange}
		/>
	);
}
