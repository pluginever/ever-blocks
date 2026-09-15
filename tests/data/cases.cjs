module.exports = {
	'spacing-longhands': {
		spacing: {
			padding: {
				top: '2rem',
				right: '1rem',
				bottom: '2rem',
				left: '1rem',
			},
			margin: {
				top: '0',
				bottom: '3rem',
			},
		},
	},
	'spacing-shorthand': {
		spacing: {
			padding: '2rem',
			margin: '1rem',
		},
	},
	'spacing-presets': {
		spacing: {
			padding: {
				top: 'var:preset|spacing|40',
				bottom: 'var:preset|spacing|60',
			},
			blockGap: 'var:preset|spacing|30',
		},
	},
	'color-solid': {
		color: {
			text: '#123456',
			background: '#abcdef',
		},
	},
	'color-presets': {
		color: {
			text: 'var:preset|color|primary',
			background: 'var:preset|color|contrast',
		},
	},
	'color-gradient': {
		color: {
			gradient: 'linear-gradient(135deg,#000 0%,#fff 100%)',
		},
	},
	'border-uniform': {
		border: {
			color: '#f00',
			width: '2px',
			style: 'dashed',
			radius: '8px',
		},
	},
	'border-per-side': {
		border: {
			top: {
				color: '#f00',
				width: '1px',
				style: 'solid',
			},
			bottom: {
				color: '#00f',
				width: '3px',
				style: 'dotted',
			},
		},
	},
	'border-radius-corners': {
		border: {
			radius: {
				topLeft: '8px',
				topRight: '0',
				bottomLeft: '0',
				bottomRight: '8px',
			},
		},
	},
	shadow: {
		shadow: '0 5px 30px #123f5226',
	},
	'shadow-preset': {
		shadow: 'var:preset|shadow|natural',
	},
	dimensions: {
		dimensions: {
			minHeight: '400px',
			aspectRatio: '16/9',
		},
	},
	'typography-full': {
		typography: {
			fontSize: '20px',
			lineHeight: '1.4',
			fontWeight: '600',
			fontStyle: 'italic',
			letterSpacing: '0.5px',
			textTransform: 'uppercase',
			textDecoration: 'underline',
			fontFamily: 'Inter, sans-serif',
		},
	},
	'typography-presets': {
		typography: {
			fontSize: 'var:preset|font-size|large',
			fontFamily: 'var:preset|font-family|body',
		},
	},
	'background-image': {
		background: {
			backgroundImage: {
				url: 'https://example.com/a.jpg',
			},
			backgroundSize: 'cover',
			backgroundPosition: '50% 50%',
			backgroundRepeat: 'no-repeat',
		},
	},
	empty: {},
	mixed: {
		spacing: {
			padding: {
				top: '1rem',
			},
		},
		color: {
			text: 'var:preset|color|primary',
		},
		border: {
			radius: '4px',
		},
		typography: {
			fontSize: '18px',
		},
		shadow: '0 1px 2px #0002',
	},
	'alpha-color-rgba': {
		color: {
			text: 'rgba(1,2,3,0.5)',
		},
	},
	'alpha-shadow-rgba': {
		shadow: '0 1px 2px rgba(0,0,0,0.2)',
	},
	'alpha-color-mix': {
		shadow: '0 1px 2px color-mix(in srgb, #000 20%, transparent)',
	},
	'alpha-hex8': {
		color: {
			text: '#00000033',
		},
		shadow: '0 1px 2px #00000033',
	},
	'gradient-rgba': {
		color: {
			gradient: 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, #fff 100%)',
		},
	},
};
