import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterChip from '../ui/FilterChip'

describe('FilterChip', () => {
  it('renders the label', () => {
    render(<FilterChip label="전체" selected={false} onClick={() => {}} />)
    expect(screen.getByText('전체')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<FilterChip label="서울" selected={false} onClick={onClick} />)
    fireEvent.click(screen.getByText('서울'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies selected styles when selected', () => {
    const { container } = render(
      <FilterChip label="서울" selected={true} onClick={() => {}} />
    )
    const button = container.querySelector('button')
    expect(button?.className).toContain('signature-gradient')
  })

  it('applies unselected styles when not selected', () => {
    const { container } = render(
      <FilterChip label="서울" selected={false} onClick={() => {}} />
    )
    const button = container.querySelector('button')
    expect(button?.className).toContain('bg-secondary-container')
  })
})
