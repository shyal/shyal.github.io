// Wording comes from ~/dev/resume (resume.json and the `short` lines in
// cv/meta.json). Keep the two in step rather than rewording here.
//
// Deliberately absent: email, phone, and anything to do with Bitcoin or
// Lightning. This page is public; the CV is not.

const icon = (path) =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

export const navbar = [
	{ href: '/', label: 'Home', icon: icon('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>') },
	{ href: '/#projects', label: 'Projects', icon: icon('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>') },
	{ href: '/archive', label: 'Archive', icon: icon('<path d="M2 6h4l2 3h14v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/><path d="M2 6V4a2 2 0 0 1 2-2h5l2 3"/>') }
];

export const social = [
	{ href: 'https://github.com/shyal', label: 'GitHub', icon: icon('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>') },
	{ href: 'https://uk.linkedin.com/in/shyal', label: 'LinkedIn', icon: icon('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>') },
	{ href: 'https://www.imdb.com/name/nm1806650/', label: 'IMDb', icon: icon('<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>') }
];

export const profile = {
	name: 'Shyal Beardsley',
	initials: 'SB',
	avatar: '/img/me.png',
	greeting: "Hi, I'm Shyal 👋",
	tagline:
		'Senior software engineer. Pipeline infrastructure for VFX studios, and lately LLM products.',
	summary:
		"I write software for film and VFX studios and, more recently, for products built on language models. At MPC, Prime Focus and Cinesite I built pipeline tools and the infrastructure under them. At the AI Objectives Institute I built Talk to the City, an LLM interface for collective decision-making. I co-founded FlowPilot Studio, a SaaS for VFX studios, and I run Claude Code Manila, a fortnightly meetup where teams build and deploy an app in a session."
};

export const skills = [
	'Python', 'TypeScript', 'Rust', 'C++', 'SQL',
	'FastAPI', 'PostgreSQL', 'Supabase', 'Redis Streams', 'RabbitMQ', 'Celery',
	'SvelteKit', 'Svelte 5', 'Tailwind',
	'AWS', 'Vercel', 'Docker', 'NGINX', 'GitHub Actions', 'Grafana Loki', 'Linux',
	'Claude API', 'LLM pipelines', 'UMAP', 'HDBSCAN', 'BERTopic',
	'SOC2 Type 2', 'MPAA'
];

export const work = [
	{
		company: 'Claude Code Manila',
		initials: 'CC',
		logo: '/logos/ccm.svg',
		fit: 'cover',
		title: 'Founder & Community Lead',
		start: '2026',
		end: '',
		href: 'https://www.ccm.pm',
		description: 'Fortnightly in-person sessions in Manila since June 2026. Attendees are split into teams, incept an idea, define it precisely under time pressure, build it and deploy it. Each session has a topic: RAG, benchmarks, agentic pipelines. 700+ members.'
	},
	{
		company: 'FlowPilot Studio',
		initials: 'FP',
		href: '/work/flowpilot',
		logo: '/logos/flowpilot.png',
		fit: 'cover',
		title: 'Co-founder, Senior Developer',
		start: '2025',
		end: '2026',
		description: 'A SaaS for VFX and animation studios. It connects to a studio\'s Flow Production Tracking (ShotGrid) database, builds charts and tables from plain-English requests, and runs automations triggered by FPT webhooks. I architected the infrastructure, co-built the backend and the frontend, and did the SOC2 Type 2 and MPAA work myself.'
	},
	{
		company: 'AI Objectives Institute',
		initials: 'AI',
		logo: '/logos/aoi.png',
		fit: 'cover',
		title: 'Senior Software Developer',
		start: '2023',
		end: '2024',
		description: "Built Talk to the City, an LLM interface for collective decision-making: a dependency graph of 50 processing nodes so each dataset gets its own pipeline topology, the Svelte frontend, synthetic datasets, and the Python backend for argument and topic extraction. Onboarded Taiwan's Ministry of Digital Affairs."
	},
	{
		company: 'Amazon / Spider Pictures',
		initials: 'AM',
		logo: '/logos/spider.svg',
		fit: 'contain',
		title: 'Software Developer, contract',
		start: '2021',
		end: '2021',
		description: 'Pipeline tools to sync assets between S3, Shotgun, Maya and Unity, and asset normalisation to enforce naming conventions across Unreal Engine, Maya and Shotgun.'
	},
	{
		company: 'Laxmi Therapeutic Devices',
		initials: 'LT',
		logo: '/logos/laxmi.svg',
		fit: 'cover',
		title: 'Software Developer, contract',
		start: '2019',
		end: '2020',
		description: "Migrated Laxmi's Matlab machine learning codebase, which turns amperometric data from a proprietary device into blood glucose readings, to Python and NumPy. The results matched at any level of precision."
	},
	{
		company: 'Cinesite',
		initials: 'CS',
		logo: '/logos/cinesite.png',
		fit: 'cover',
		title: 'Senior Software Developer',
		start: '2017',
		end: '2018',
		description: 'Moved the global pipeline infrastructure from needing constant babysitting to being fully automated and self-healing: ftrack media server performance (uWSGI, Redis LFU caching, Docker), MariaDB replication and encoding fixes, RabbitMQ event workers that reconnect, and documentation for every major host, VM and service.'
	},
	{
		company: 'SpectoLabs',
		initials: 'SL',
		logo: '/logos/specto.svg',
		fit: 'cover',
		title: 'Software Developer, contract',
		start: '2016',
		end: '2016',
		description: 'Maintained a service virtualisation suite used by Heathrow Airport and wrote HoverPy (79 GitHub stars). My article on it reached the Hacker News front page.'
	},
	{
		company: 'Korian Medica',
		initials: 'KM',
		logo: '/logos/korian.png',
		fit: 'contain',
		title: 'Software Developer, contract',
		start: '2016',
		end: '2016',
		description: "A cloud platform for storing and sharing internal patient documents across Korian Medica, Europe's largest retirement homes provider."
	},
	{
		company: 'Cookoon',
		initials: 'CK',
		logo: '/logos/cookoon.svg',
		fit: 'cover',
		title: 'Software Developer',
		start: '2015',
		end: '2016',
		description: 'Built the cookoon.club social dining platform through to its seed funding: servers, backend, frontend, database and CRM.'
	},
	{
		company: 'Sky',
		initials: 'SK',
		logo: '/logos/sky.png',
		fit: 'contain',
		title: 'Senior Software Engineer',
		start: '2014',
		end: '2015',
		description: 'C++ features for the Sky Q EPG, a service virtualisation server that cached the service API so teams could keep working through downtime, and the prototype for voice commands on the remote.'
	},
	{
		company: 'Prime Focus World',
		initials: 'PF',
		logo: '/logos/primefocus.svg',
		fit: 'contain',
		title: 'Senior Software Engineer',
		start: '2012',
		end: '2014',
		description: 'Python, PyQt and Maya API tools for stereo tracking QA (75% less QA time), camera publishing into Shotgun, custom Alembic exporters, and asset sync between London, Mumbai and Vancouver.'
	},
	{
		company: 'Reliance Digital Domain',
		initials: 'DD',
		logo: '/logos/digitaldomain.png',
		fit: 'contain',
		title: 'Senior Manager',
		start: '2011',
		end: '2012',
		description: 'Led the development of a set of 3D scene sanitation tools in C++ and Python, later open-sourced as OSBTools (67 stars, 16 forks).'
	},
	{
		company: 'Digital Vision',
		initials: 'DV',
		logo: '/logos/digitalvision.png',
		fit: 'cover',
		title: 'Software Engineer',
		start: '2007',
		end: '2010',
		description: "C++ for the company's colour-grading products: an OpenGL keyframe editor with Bezier interpolation, low-latency networking for the hardware control panel, and the 64-bit port of the codebase."
	},
	{
		company: 'The Moving Picture Company',
		initials: 'MP',
		logo: '/logos/mpc.png',
		fit: 'contain',
		title: 'Software Engineer',
		start: '2004',
		end: '2007',
		description: 'C++ and Maya API tools for stereoscopy, physics (Havok in Maya) and camera image planes, used on The Chronicles of Narnia, Harry Potter and The Da Vinci Code. Built the version control system for the site\'s Maya plugins.'
	}
];

export const education = [
	{
		school: 'The University of Wales',
		initials: 'UW',
		logo: '/logos/wales.svg',
		fit: 'cover',
		degree: 'B.Sc. 3D Graphics',
		start: '2000',
		end: '2003'
	}
];

export const video = {
	src: 'https://d2cng34tzqffkl.cloudfront.net/video/tttc-turbo-mods-same-sex-marriage-survey-pipeline.mp4',
	poster: '/work/talk-to-the-city.jpg',
	duration: '4:52'
};

export const projects = [
	{
		title: 'Talk to the City',
		href: '/work/talk-to-the-city',
		dates: '2023 - 2024',
		description:
			"An LLM interface for collective decision-making, built at the AI Objectives Institute. Onboarded Taiwan's Ministry of Digital Affairs.",
		tags: ['Svelte', 'Firebase', 'Python', 'UMAP', 'HDBSCAN', 'BERTopic'],
		graphic: 'tttc',
		links: [
			{ type: 'Video', href: '/work/talk-to-the-city' },
			{ type: 'Source', href: 'https://github.com/AIObjectives/talk-to-the-city-reports' }
		]
	},
	{
		title: 'FlowPilot Studio',
		href: '/work/flowpilot',
		dates: '2025 - 2026',
		description:
			"A SaaS for VFX studios, co-founded and co-built with Kevin Sallée. Connects to a studio's Flow Production Tracking database, builds charts and tables from plain-English requests, and runs automations from FPT webhooks.",
		tags: ['SvelteKit', 'Supabase', 'FastAPI', 'Rust', 'Redis Streams', 'AWS', 'Claude API'],
		graphic: 'flowpilot',
		links: [{ type: 'Video', href: '/work/flowpilot' }]
	},
	{
		title: 'Claude Code Manila',
		href: 'https://www.ccm.pm',
		dates: '2026 - Present',
		description:
			'A fortnightly in-person meetup in Manila. Teams build and deploy an app around a topic each session and are scored against a rubric. 700+ members.',
		tags: ['Claude Code', 'RAG', 'Agents'],
		image: '/work/ccm.jpg',
		links: [{ type: 'Website', href: 'https://www.ccm.pm' }]
	},
	{
		title: 'HoverPy',
		href: 'https://github.com/SpectoLabs/hoverpy',
		dates: '2016',
		description:
			'A service virtualisation library for Python, on PyPI. My article on it reached the Hacker News front page.',
		tags: ['Python', 'Go', 'Hoverfly'],
		graphic: 'hoverpy',
		links: [{ type: 'Source', href: 'https://github.com/SpectoLabs/hoverpy' }]
	},
	{
		title: 'OSBTools',
		href: 'https://github.com/shyal/osbtools',
		dates: '2011 - 2012',
		description:
			'3D scene sanitation tools for Maya, written at Reliance Digital Domain and later open-sourced. Adopted by other studios.',
		tags: ['C++', 'Python', 'Maya'],
		graphic: 'osbtools',
		links: [{ type: 'Source', href: 'https://github.com/shyal/osbtools' }]
	}
];
