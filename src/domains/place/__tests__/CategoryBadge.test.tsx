import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CategoryBadge from '../components/CategoryBadge'

describe('CategoryBadge', () => {
  it('renders the correct label for yarn_store', () => {
    render(<CategoryBadge category="yarn_store" />)
    expect(screen.getByText('실 가게')).toBeInTheDocument()
  })

  it('renders the correct label for studio', () => {
    render(<CategoryBadge category="studio" />)
    expect(screen.getByText('공방')).toBeInTheDocument()
  })

  it('renders the correct label for cafe', () => {
    render(<CategoryBadge category="cafe" />)
    expect(screen.getByText('뜨개카페')).toBeInTheDocument()
  })

  it('renders the correct label for popup', () => {
    render(<CategoryBadge category="popup" />)
    expect(screen.getByText('팝업')).toBeInTheDocument()
  })

  it('applies category color as background', () => {
    const { container } = render(<CategoryBadge category="yarn_store" />)
    const span = container.querySelector('span')
    expect(span?.style.backgroundColor).toBe('rgb(145, 71, 43)')
  })

  it('applies md size classes', () => {
    const { container } = render(<CategoryBadge category="studio" size="md" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('px-3')
  })

  it('applies sm size classes by default', () => {
    const { container } = render(<CategoryBadge category="studio" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('px-2.5')
  })
})
