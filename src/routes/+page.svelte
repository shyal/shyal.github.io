<script>
	import BlurFade from '$lib/components/portfolio/BlurFade.svelte';
	import Dock from '$lib/components/portfolio/Dock.svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { site } from '$lib/site.js';
	import { profile, skills, work, education, projects, navbar, social } from '$lib/cv.js';

	const D = 0.04;
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={profile.tagline} />
	<link rel="canonical" href={site.url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={site.name} />
	<meta property="og:description" content={profile.tagline} />
	<meta property="og:url" content={site.url} />
	<meta property="og:image" content="{site.url}{profile.avatar}" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<div class="relative mx-auto min-h-screen max-w-2xl px-6 py-12 sm:py-24">
	<main class="flex min-h-[100dvh] flex-col space-y-10 pb-24">
		<section id="hero">
			<div class="mx-auto w-full max-w-2xl space-y-8">
				<div class="flex justify-between gap-2">
					<div class="flex flex-1 flex-col space-y-1.5">
						<BlurFade delay={D} class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
							{profile.greeting}
						</BlurFade>
						<BlurFade delay={D} class="max-w-[600px] md:text-xl">{profile.tagline}</BlurFade>
					</div>
					<BlurFade delay={D}>
						<img
							src={profile.avatar}
							alt={profile.name}
							width="112"
							height="112"
							class="size-28 rounded-full border object-cover"
						/>
					</BlurFade>
				</div>
			</div>
		</section>

		<section id="about">
			<BlurFade delay={D}><h2 class="text-xl font-bold">About</h2></BlurFade>
			<BlurFade delay={D * 1.4}>
				<p class="max-w-full font-sans text-sm text-pretty text-muted-foreground">{profile.summary}</p>
			</BlurFade>
		</section>

		<section id="work">
			<div class="flex min-h-0 flex-col gap-y-3">
				<BlurFade delay={D}><h2 class="text-xl font-bold">Work Experience</h2></BlurFade>
				{#each work as job, i}
					<BlurFade delay={D * 1.2 + i * 0.05}>
						<ResumeCard {...job} />
					</BlurFade>
				{/each}
			</div>
		</section>

		<section id="education">
			<div class="flex min-h-0 flex-col gap-y-3">
				<BlurFade delay={D}><h2 class="text-xl font-bold">Education</h2></BlurFade>
				{#each education as edu, i}
					<BlurFade delay={D * 1.2 + i * 0.05}>
						<ResumeCard
							company={edu.school}
							initials={edu.initials}
							logo={edu.logo}
							fit={edu.fit}
							title={edu.degree}
							start={edu.start}
							end={edu.end}
						/>
					</BlurFade>
				{/each}
			</div>
		</section>

		<section id="skills">
			<div class="flex min-h-0 flex-col gap-y-3">
				<BlurFade delay={D}><h2 class="text-xl font-bold">Skills</h2></BlurFade>
				<div class="flex flex-wrap gap-1">
					{#each skills as skill, i}
						<BlurFade delay={D * i + 0.002}><Badge>{skill}</Badge></BlurFade>
					{/each}
				</div>
			</div>
		</section>

		<section id="projects">
			<div class="w-full space-y-12 py-12">
				<BlurFade delay={D}>
					<div class="flex flex-col items-center justify-center space-y-4 text-center">
						<div class="space-y-2">
							<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
								Projects
							</div>
							<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Selected work</h2>
							<p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Two LLM products, a community, and two open-source tools from the VFX years.
							</p>
						</div>
					</div>
				</BlurFade>
				<div class="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
					{#each projects as project, i}
						<BlurFade delay={D * 1.5 + i * 0.05}>
							<ProjectCard {...project} />
						</BlurFade>
					{/each}
				</div>
			</div>
		</section>

		<section id="contact">
			<div class="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
				<BlurFade delay={D * 2}>
					<div class="space-y-3">
						<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
							Contact
						</div>
						<h2 class="text-3xl font-bold tracking-tight sm:text-5xl">Get in touch</h2>
						<p class="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Message me
							<a href="https://uk.linkedin.com/in/shyal" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">on LinkedIn</a>.
						</p>
					</div>
				</BlurFade>
			</div>
		</section>
	</main>

	<Dock items={navbar} {social} />
</div>
