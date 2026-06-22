@php
    $logoUrl ??= null;
@endphp

<a href="{{ filament()->getUrl() }}" class="flex items-center gap-3 outline-none">
    @if ($logoUrl)
        <img src="{{ $logoUrl }}" alt="" class="h-8 w-auto rounded" loading="eager">
    @endif
</a>
