<script>
	import { cn } from "$lib/utils.js";

	let { class: className, variant = "default", children, ...restProps } = $props();

	const variants = {
		default: "border-transparent bg-primary text-primary-foreground shadow",
		secondary: "border-transparent bg-secondary text-secondary-foreground",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
		outline: "text-foreground",
	};
</script>

<div
	class={cn(
		"inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		variants[variant],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
