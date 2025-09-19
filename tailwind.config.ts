import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./public/index.html",
	],
	safelist: [
		// Critical classes that should always be included
		'container', 'flex', 'grid', 'block', 'inline-block', 'hidden', 'visible',
		'w-full', 'h-full', 'min-h-screen', 'max-w-screen', 'mx-auto', 'px-4', 'py-2',
		'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
		'font-normal', 'font-medium', 'font-semibold', 'font-bold',
		'text-left', 'text-center', 'text-right',
		'text-gray-900', 'text-gray-600', 'text-gray-500', 'text-white',
		'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-blue-500', 'bg-blue-600',
		'border-gray-200', 'border-gray-300', 'border-blue-500',
		'p-2', 'p-4', 'p-6', 'px-2', 'px-4', 'px-6', 'py-2', 'py-4', 'py-6',
		'm-2', 'm-4', 'm-6', 'mx-2', 'mx-4', 'mx-6', 'my-2', 'my-4', 'my-6',
		'mt-2', 'mt-4', 'mb-2', 'mb-4', 'ml-2', 'ml-4', 'mr-2', 'mr-4',
		'cursor-pointer', 'cursor-not-allowed',
		'transition', 'duration-200', 'duration-300', 'ease-in-out',
		'shadow-sm', 'shadow-md', 'shadow-lg',
		'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
		'relative', 'absolute', 'fixed', 'sticky',
		'top-0', 'bottom-0', 'left-0', 'right-0',
		'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
		// Dynamic classes
		/^bg-/, /^text-/, /^border-/, /^hover:/, /^focus:/, /^active:/,
		/^animate-/, /^transition-/, /^duration-/, /^ease-/,
		/^sm:/, /^md:/, /^lg:/, /^xl:/, /^2xl:/,
		/^group-/, /^peer-/, /^data-/, /^aria-/,
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'heading': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
				'body': ['Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					dark: 'hsl(var(--primary-dark))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-subtle': 'var(--gradient-subtle)',
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'glow': 'var(--shadow-glow)',
				'soft': 'var(--shadow-soft)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					from: {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(224 79% 49% / 0.2)'
					},
					'50%': {
						boxShadow: '0 0 30px hsl(224 79% 49% / 0.4)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
