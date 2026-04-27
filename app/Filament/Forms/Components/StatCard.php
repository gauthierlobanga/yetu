<?php

// app/Filament/Forms/Components/StatCard.php

namespace App\Filament\Forms\Components;

use Closure;
use Filament\Forms\Components\Field;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Model;

class StatCard extends Field
{
    protected string $view = 'filament.forms.components.stat-card';

    protected string|Closure|null $icon = null;

    protected string|Closure|null $color = 'primary';

    protected ?Closure $statValue = null;

    protected string|Closure|null $statLabel = null;

    /**
     * @return $this
     */
    public function icon(string|Closure|null $icon): static
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return $this
     */
    public function color(string|Closure|null $color): static
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return $this
     */
    public function statValue(?Closure $value): static
    {
        $this->statValue = $value;

        return $this;
    }

    /**
     * @return $this
     */
    public function statLabel(string|Closure|null $label): static
    {
        $this->statLabel = $label;

        return $this;
    }

    /**
     * @return Closure|mixed|string|null
     */
    public function getIcon(): mixed
    {
        // Utiliser evaluate pour les closures
        return $this->evaluate($this->icon);
    }

    /**
     * @return Closure|mixed|string|null
     */
    public function getColor(): mixed
    {
        return $this->evaluate($this->color);
    }

    /**
     * @return Closure|mixed|null
     */
    public function getStatValue(): mixed
    {
        // Passer le record à la closure si nécessaire
        return $this->evaluate($this->statValue, [
            'record' => $this->getRecord(),
        ]);
    }

    /**
     * @return Closure|Htmlable|mixed|string|null
     */
    public function getStatLabel(): mixed
    {
        return $this->evaluate($this->statLabel) ?? $this->getLabel();
    }

    /**
     * Récupère le record actuel
     */
    public function getRecord(bool $withContainerRecord = true): Model|array|null
    {
        if ($withContainerRecord) {
            $container = $this->getContainer();

            if (method_exists($container, 'getRecord')) {
                return $container->getRecord();
            }
        }

        return parent::getRecord($withContainerRecord);
    }
}
