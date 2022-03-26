import React from 'react'

const Input = ({ type = 'text', placeholder, value, className, onChange, required = true, options, disabled = false, ...inputProps }) => {
    if (type === 'select') {
        return (
            <select className={[
                'flex flex-col relative w-full mt-2 mb-[16px]',
                'outline-none w-full text-contentl transition-all text-layout-700 placeholder:text-layout-500 px-[12px] py-[8px] rounded bg-layout-200 peer',
                ' focus:bg-accent-25 focus:text-layout-800',
                className
            ].join(' ')}
                value={value}
                onChange={onChange}>
                {/* '' option */}
                <option value=''>{placeholder}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        )
    }
    return (
        <input
            className={[
                'flex flex-col relative w-full mt-2 mb-[16px]',
                'outline-none w-full text-contentl transition-all text-layout-700 placeholder:text-layout-500 px-[12px] py-[8px] rounded bg-layout-200 peer',
                ' focus:bg-accent-25 focus:text-layout-800',
                disabled && 'cursor-not-allowed',
                className
            ].join(' ')}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            {...inputProps}
        />
    )
}

export default Input