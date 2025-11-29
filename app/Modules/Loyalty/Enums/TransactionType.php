<?php

namespace App\Modules\Loyalty\Enums;

enum TransactionType: string
{
    case EARNED = 'earned';
    case SPENT = 'spent';
    case EXPIRED = 'expired';
    case REFUNDED = 'refunded';
    case ADMIN_ADJUSTMENT = 'admin_adjustment';

    public function label(): string
    {
        return match ($this) {
            self::EARNED => 'Points gagnés',
            self::SPENT => 'Points dépensés',
            self::EXPIRED => 'Points expirés',
            self::REFUNDED => 'Points remboursés',
            self::ADMIN_ADJUSTMENT => 'Ajustement administrateur',
        };
    }

    public function isCredit(): bool
    {
        return \in_array($this, [self::EARNED, self::REFUNDED, self::ADMIN_ADJUSTMENT]);
    }

    public function isDebit(): bool
    {
        return \in_array($this, [self::SPENT, self::EXPIRED]);
    }
}
