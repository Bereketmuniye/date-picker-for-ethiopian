<?php

namespace EthiopianDatePicker\Tests;

use PHPUnit\Framework\TestCase;
use EthiopianDatePicker\EthiopianDatePicker;

class EthiopianDatePickerTest extends TestCase
{
    public function testGregorianToEthiopian()
    {
        // Test known conversion: September 11, 2023 (Gregorian) = Meskerem 1, 2016 (Ethiopian)
        $result = EthiopianDatePicker::gregorianToEthiopian(2023, 9, 11);
        $this->assertEquals([2016, 1, 1], $result);
        
        // Test current date
        $today = EthiopianDatePicker::today();
        $this->assertCount(3, $today);
        $this->assertIsInt($today[0]); // year
        $this->assertIsInt($today[1]); // month
        $this->assertIsInt($today[2]); // day
    }
    
    public function testIsLeapYear()
    {
        $this->assertTrue(EthiopianDatePicker::isLeapYear(2015)); // 2015 % 4 = 3
        $this->assertFalse(EthiopianDatePicker::isLeapYear(2016)); // 2016 % 4 = 0
        $this->assertTrue(EthiopianDatePicker::isLeapYear(2019)); // 2019 % 4 = 3
    }
    
    public function testGetAmharicMonths()
    {
        $months = EthiopianDatePicker::getAmharicMonths();
        $this->assertCount(13, $months);
        $this->assertEquals('መስከረም', $months[1]);
        $this->assertEquals('ጳጉሜን', $months[13]);
    }
    
    public function testGetEnglishMonths()
    {
        $months = EthiopianDatePicker::getEnglishMonths();
        $this->assertCount(13, $months);
        $this->assertEquals('Meskerem', $months[1]);
        $this->assertEquals('Pagume', $months[13]);
    }
    
    public function testFormatDate()
    {
        $date = [2016, 1, 1];
        
        // Test English long format
        $englishLong = EthiopianDatePicker::formatDate($date, 'english', 'long');
        $this->assertEquals('1 Meskerem 2016', $englishLong);
        
        // Test English short format
        $englishShort = EthiopianDatePicker::formatDate($date, 'english', 'short');
        $this->assertEquals('2016-1-1', $englishShort);
        
        // Test Amharic long format
        $amharicLong = EthiopianDatePicker::formatDate($date, 'amharic', 'long');
        $this->assertEquals('1 መስከረም 2016', $amharicLong);
    }
}
