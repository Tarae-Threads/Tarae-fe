import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CategoryBadge from '../components/CategoryBadge'

describe('CategoryBadge', () => {
  it('renders the correct label for 뜨개샵', () => {
    render(<CategoryBadge category="뜨개샵" />)
    expect(screen.getByText('뜨개샵')).toBeInTheDocument()
  })

  it('renders the correct label for 공방', () => {
    render(<CategoryBadge category="공방" />)
    expect(screen.getByText('공방')).toBeInTheDocument()
  })

  it('renders the correct label for 뜨개카페', () => {
    render(<CategoryBadge category="뜨개카페" />)
    expect(screen.getByText('뜨개카페')).toBeInTheDocument()
  })

  it('renders the correct label for 손염색실', () => {
    render(<CategoryBadge category="손염색실" />)
    expect(screen.getByText('손염색실')).toBeInTheDocument()
  })

  it('renders the correct label for 공예용품점', () => {
    render(<CategoryBadge category="공예용품점" />)
    expect(screen.getByText('공예용품점')).toBeInTheDocument()
  })

  it('applies category color as background', () => {
    const { container } = render(<CategoryBadge category="뜨개샵" />)
    const span = container.querySelector('span')
    expect(span?.style.backgroundColor).toBe('rgb(255, 219, 207)')
  })

  it('applies md size classes', () => {
    const { container } = render(<CategoryBadge category="공방" size="md" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('px-3')
  })

  it('applies sm size classes by default', () => {
    const { container } = render(<CategoryBadge category="공방" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('px-2.5')
  })

  it('falls back for unknown category', () => {
    render(<CategoryBadge category="unknown" />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})
