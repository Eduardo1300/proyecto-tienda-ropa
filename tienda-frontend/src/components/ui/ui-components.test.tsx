import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Badge from './Badge';
import Button from './Button';
import Card from './Card';

describe('Badge Component', () => {
  it('should render with default props', () => {
    render(<Badge>Test Badge</Badge>);
    
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex');
  });

  it('should render with different variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;
    
    variants.forEach(variant => {
      render(<Badge variant={variant}>{variant}</Badge>);
      const badge = screen.getByText(variant);
      expect(badge).toBeInTheDocument();
    });
  });

  it('should render with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach(size => {
      render(<Badge size={size}>{size}</Badge>);
      const badge = screen.getByText(size);
      expect(badge).toBeInTheDocument();
    });
  });

  it('should render with icon', () => {
    render(
      <Badge icon={<span data-testid="icon">★</span>}>With Icon</Badge>
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render with pulse animation', () => {
    render(<Badge pulse>Pulsing</Badge>);
    
    const badge = screen.getByText('Pulsing');
    expect(badge).toHaveClass('animate-pulse');
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });
});

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button>Click Me</Button>);
    
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>Disabled</Button>
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Loading|Cargando/);
  });

  it('should render with icon', () => {
    render(
      <Button icon={<span data-testid="btn-icon">+</span>}>With Icon</Button>
    );
    
    expect(screen.getByTestId('btn-icon')).toBeInTheDocument();
  });
});

describe('Card Component', () => {
  it('should render children', () => {
    render(
      <Card>
        <div data-testid="card-content">Card Content</div>
      </Card>
    );
    
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should apply hover effect', () => {
    render(<Card hover>Hover Card</Card>);
    
    const card = screen.getByText('Hover Card');
    expect(card).toHaveClass('card-hover');
  });

  it('should apply different paddings', () => {
    const paddings = ['none', 'sm', 'md', 'lg'] as const;
    
    paddings.forEach(padding => {
      render(<Card padding={padding}>{padding}</Card>);
      const card = screen.getByText(padding);
      expect(card).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    render(<Card className="custom-card">Custom</Card>);
    
    const card = screen.getByText('Custom');
    expect(card).toHaveClass('custom-card');
  });
});
