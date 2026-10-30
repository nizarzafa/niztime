<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Planning uses a versioned, validated local persistence provider because no database is configured and the requested fallback is browser-local storage; write successfully before updating visible state.
- Keep scheduling and reporting as pure functions in the planning module so duration, availability, history and completion rules are independently testable.
- Scheduled entries snapshot task details and store completion once per entry, preserving completed history when source tasks change.
