<?php

namespace App\Enums;

// Tipo de fuente oficial de un fondo (Master Plan sección 57).
enum SourceType: string
{
    case OfficialWeb = 'official_web';
    case OfficialDocument = 'official_document';
    case OfficialApi = 'official_api';
    case OfficialPlatform = 'official_platform';
    case Other = 'other';
}
