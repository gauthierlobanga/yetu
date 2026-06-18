<?php

$dir = new RecursiveDirectoryIterator('app/Http/Controllers/Vendor');
$iterator = new RecursiveIteratorIterator($dir);
$regex = new RegexIterator($iterator, '/^.+\.php$/i', RecursiveRegexIterator::GET_MATCH);

$missingDocs = [];

foreach ($regex as $file) {
    $filePath = $file[0];
    $content = file_get_contents($filePath);
    $lines = explode("\n", $content);

    $inClass = false;
    for ($i = 0; $i < count($lines); $i++) {
        $line = trim($lines[$i]);
        if (str_starts_with($line, 'class ')) {
            $inClass = true;
        }

        if ($inClass && preg_match('/^(public|protected|private)\s+(static\s+)?function\s+([a-zA-Z0-9_]+)/', $line, $matches)) {
            $methodName = $matches[3];
            // Check previous lines for docblock
            $hasDoc = false;
            for ($j = $i - 1; $j >= max(0, $i - 5); $j--) {
                $prevLine = trim($lines[$j]);
                if (str_ends_with($prevLine, '*/') || str_starts_with($prevLine, '*')) {
                    $hasDoc = true;
                    break;
                }
                if ($prevLine === '' || str_starts_with($prevLine, '#[')) {
                    continue;
                }
                if (! str_ends_with($prevLine, '*/')) {
                    break;
                }
            }
            if (! $hasDoc) {
                $missingDocs[$filePath][] = $methodName;
            }
        }
    }
}

foreach ($missingDocs as $file => $methods) {
    echo str_replace('C:\\Users\\user\\Documents\\Projets\\yetu\\', '', $file).' ('.count($methods)." méthodes)\n";
}
