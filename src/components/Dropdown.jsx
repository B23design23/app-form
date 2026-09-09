import * as Select from '@radix-ui/react-select'
import './Dropdown.css'

function Dropdown({ value, onChange, options, placeholder = 'Sélectionner', disabled = false, name }) {
  return (
    <Select.Root value={value || undefined} onValueChange={onChange} disabled={disabled} name={name}>
      <Select.Trigger className="dropdown-trigger">
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="dropdown-chevron">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="dropdown-content" position="popper" sideOffset={6}>
          <Select.Viewport className="dropdown-viewport">
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value} className="dropdown-item">
                <Select.ItemIndicator className="dropdown-item-indicateur">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Select.ItemIndicator>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default Dropdown
