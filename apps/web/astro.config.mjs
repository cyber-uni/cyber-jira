import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
	site: 'https://cyber-uni.github.io',
	base: '/cyber-jira',
	vite: { plugins: [tailwindcss()] },
	integrations: [
		starlight({
			title: 'cyber-jira',
			description: 'Agent skills for Jira, built on the jira CLI.',
			// The cyber-* family mark. The favicon self-themes; the header logo is a light/dark pair
			// because Starlight switches on data-theme, not on the OS setting.
			favicon: '/img/logo.svg',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				alt: 'cyber-jira',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/cyber-uni/cyber-jira',
				},
			],
			customCss: ['./src/styles/global.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'Getting Started', slug: 'getting-started' },
					],
				},
				{
					label: 'Skills',
					items: [
						{ label: 'jira', slug: 'skills/jira' },
						{ label: 'init-jira', slug: 'skills/init-jira' },
						{ label: 'config-jira', slug: 'skills/config-jira' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Repo config', slug: 'reference/repo-config' },
						{ label: 'Where settings live', slug: 'reference/settings' },
					],
				},
			],
			editLink: {
				baseUrl: 'https://github.com/cyber-uni/cyber-jira/edit/main/apps/web/',
			},
		}),
	],
})
