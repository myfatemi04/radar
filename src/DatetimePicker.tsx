import { useCallback, useEffect, useRef } from 'react';

const baseStyle = {
	padding: '0.5em',
};

export default function DatetimePicker({
	value,
	onChange,
	disabled = false,
}: {
	value: Date | null;
	onChange: (date: Date | null) => void;
	disabled?: boolean;
}) {
	const ref = useRef<HTMLInputElement>(null);

	const onChangeCallback = useCallback(
		e => {
			// YYYY-MM-DDTHH:mm
			const value = e.target.value as string;

			// In order to create a date in the correct timezone,
			// we need to use the UTC version of the date
			const date = new Date(value.replace(/-/g, '/').replace('T', ' '));

			onChange(date);
		},
		[onChange]
	);

	useEffect(() => {
		if (ref.current) {
			if (!value) {
				ref.current.value = '';
			} else {
				// Use local date string
				const year = value.getFullYear().toString().padStart(4, '0');
				const month = (value.getMonth() + 1).toString().padStart(2, '0');
				const day = value.getDate().toString().padStart(2, '0');
				const date = `${year}-${month}-${day}`;
				const hours = value.getHours().toString().padStart(2, '0');
				const minutes = value.getMinutes().toString().padStart(2, '0');
				const time = `${hours}:${minutes}`;
				ref.current.value = `${date}T${time}`;
			}
		}
	}, [value]);

	return (
		<input
			type='datetime-local'
			ref={ref}
			style={baseStyle}
			disabled={disabled}
			onChange={onChangeCallback}
		/>
	);
}
