import { CSSProperties } from 'react';
import DatetimePicker from './DatetimePicker';

export default function DatetimePickerNullable({
	value,
	onChange,
	style,
}: {
	value: Date | null;
	onChange: (value: Date | null) => void;
	style?: CSSProperties;
}) {
	return (
		<div style={{ display: 'flex', ...style }}>
			{value !== null ? (
				<>
					<button
						style={{ marginRight: '0.5rem' }}
						onClick={() => onChange(null)}
					>
						Clear
					</button>
					<DatetimePicker value={value} onChange={onChange} />
				</>
			) : (
				<button onClick={() => onChange(new Date())}>Add time</button>
			)}
		</div>
	);
}
