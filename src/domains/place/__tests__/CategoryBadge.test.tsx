import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CategoryBadge from '../components/CategoryBadge'

describe('CategoryBadge', () => {
  it('renders the correct label for yarn_store', () => {
    render(<CategoryBadge category="yarn_store" />)
    expect(screen.getByText('뜨개샵')).toBeInTheDocument()
  })

  it('renders the correct label for studio', () => {
    render(<CategoryBadge category="studio" />)
    expect(screen.getByText('공방')).toBeInTheDocument()
  })

  it('renders the correct label for cafe', () => {
    render(<CategoryBadge category="cafe" />)
    expect(screen.getByText('뜨개카페')).toBeInTheDocument()
  })

  it('renders the correct label for dye_shop', () => {
    render(<CategoryBadge category="dye_shop" />)
    expect(screen.getByText('손염색실')).toBeInTheDocument()
  })

  it('renders the correct label for craft_supply', () => {
    render(<CategoryBadge category="craft_supply" />)
    expect(screen.getByText('공예용품점')).toBeInTheDocument()
  })

  it('applies category color as background', () => {
    const { container } = render(<CategoryBadge category="yarn_store" />)
    const span = container.querySelector('span')
    expect(span?.style.backgroundColor).toBe('rgb(255, 219, 207)')
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
