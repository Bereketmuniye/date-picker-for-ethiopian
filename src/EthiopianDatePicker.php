<?php

namespace EthiopianDatePicker;

/**
 * Ethiopian DatePicker - A PHP library for Ethiopian calendar operations
 * 
 * @author Bereket <bekim2121@example.com>
 * @version 1.1.6
 * @license MIT
 */
class EthiopianDatePicker
{
    /**
     * Convert Gregorian date to Ethiopian date
     * 
     * @param int $year Gregorian year
     * @param int $month Gregorian month (1-12)
     * @param int $day Gregorian day
     * @return array Ethiopian date [year, month, day]
     */
    public static function gregorianToEthiopian($year, $month, $day)
    {
        // Ethiopian New Year (September 1st) calculation
        $newYear = $year - 8;
        
        if ($month < 9) {
            $newYear--;
        }
        
        // Days calculation (simplified algorithm)
        $ethiopianMonth = 1;
        $ethiopianDay = 1;
        
        // This is a basic implementation - you may want to enhance with more precise calculations
        $gregorianDays = gregoriantojd($month, $day, $year);
        $ethiopianNewYear = gregoriantojd(9, 1, $newYear + 8);
        
        $daysSinceNewYear = $gregorianDays - $ethiopianNewYear;
        
        if ($daysSinceNewYear < 0) {
            $newYear--;
            $ethiopianNewYear = gregoriantojd(9, 1, $newYear + 8);
            $daysSinceNewYear = $gregorianDays - $ethiopianNewYear;
        }
        
        $ethiopianYear = $newYear;
        $ethiopianMonth = floor($daysSinceNewYear / 30) + 1;
        $ethiopianDay = ($daysSinceNewYear % 30) + 1;
        
        // Handle month overflow (13th month has 5 or 6 days)
        if ($ethiopianMonth > 13) {
            $ethiopianMonth = 13;
            $ethiopianDay = min($ethiopianDay, self::isLeapYear($ethiopianYear) ? 6 : 5);
        }
        
        return [$ethiopianYear, $ethiopianMonth, $ethiopianDay];
    }
    
    /**
     * Convert Ethiopian date to Gregorian date
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @return array Gregorian date [year, month, day]
     */
    public static function ethiopianToGregorian($year, $month, $day)
    {
        $gregorianYear = $year + 7;
        
        if ($month >= 9 || ($month == 8 && $day >= 23)) {
            $gregorianYear++;
        }
        
        // Simplified conversion - you may want to enhance this
        $ethiopianDays = ($year - 1) * 365 + floor(($year - 1) / 4) + 
                        ($month - 1) * 30 + ($day - 1);
        
        $gregorianDays = $ethiopianDays + 78; // Approximate offset
        
        $gregorianDate = jdtogregorian($gregorianDays + 1721425);
        
        return explode('/', $gregorianDate);
    }
    
    /**
     * Check if Ethiopian year is a leap year
     * 
     * @param int $year Ethiopian year
     * @return bool
     */
    public static function isLeapYear($year)
    {
        return ($year % 4) === 3;
    }
    
    /**
     * Get Ethiopian month names in Amharic
     * 
     * @return array
     */
    public static function getAmharicMonths()
    {
        return [
            1 => 'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
            'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
        ];
    }
    
    /**
     * Get Ethiopian month names in English
     * 
     * @return array
     */
    public static function getEnglishMonths()
    {
        return [
            1 => 'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Ter', 'Yekatit',
            'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehasse', 'Pagume'
        ];
    }
    
    /**
     * Get current Ethiopian date
     * 
     * @return array Ethiopian date [year, month, day]
     */
    public static function today()
    {
        return self::gregorianToEthiopian(
            (int)date('Y'), 
            (int)date('m'), 
            (int)date('d')
        );
    }
    
    /**
     * Format Ethiopian date
     * 
     * @param array $date Ethiopian date [year, month, day]
     * @param string $language 'amharic' or 'english'
     * @param string $format 'long' or 'short'
     * @return string
     */
    public static function formatDate($date, $language = 'english', $format = 'long')
    {
        [$year, $month, $day] = $date;
        
        $months = $language === 'amharic' 
            ? self::getAmharicMonths() 
            : self::getEnglishMonths();
        
        $monthName = $months[$month] ?? '';
        
        if ($format === 'long') {
            return "$day $monthName $year";
        }
        
        return "$year-$month-$day";
    }
}
