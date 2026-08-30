<?php

namespace App\Enums;

// Roles del ecosistema (Master Plan sección 60).
enum UserRoleType: string
{
    case SuperAdmin = 'super_admin';
    case Administrador = 'administrador';
    case Curador = 'curador';
    case Comercial = 'comercial';
    case Editor = 'editor';

    /** Roles con permiso de gestionar/verificar fondos. */
    public static function fundManagers(): array
    {
        return [self::Curador, self::Administrador, self::SuperAdmin];
    }

    /** Roles con permiso de gestionar leads. */
    public static function leadManagers(): array
    {
        return [self::Comercial, self::Administrador, self::SuperAdmin];
    }
}
