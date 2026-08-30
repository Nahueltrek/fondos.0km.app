<?php

namespace App\Enums;

// Pipeline comercial (Master Plan sección 26).
enum LeadStatus: string
{
    case Nuevo = 'nuevo';
    case Contactar = 'contactar';
    case Calificado = 'calificado';
    case Diagnostico = 'diagnostico';
    case Propuesta = 'propuesta';
    case Negociacion = 'negociacion';
    case Ganado = 'ganado';
    case Perdido = 'perdido';
    case Seguimiento = 'seguimiento';
}
