<?php

namespace App\Enums;

// Estado comercial del fondo (Master Plan sección 10). Distinto de
// VerificationStatus: este es "¿está abierto?", no "¿lo verificamos?".
enum FundStatus: string
{
    case Proximo = 'proximo';
    case Abierto = 'abierto';
    case Cerrado = 'cerrado';
    case Finalizado = 'finalizado';
    case Permanente = 'permanente';
    case PorConfirmar = 'por_confirmar';
}
