<?php

class Banco
{
    private static $cont = null;
    
    public function __construct() 
    {
        die('A função Init nao é permitido!');
    }
    
    public static function conectar()
    {
        if(null == self::$cont)
        {
            try
            {
                $host = getenv('PGHOST') ?: 'localhost';
                $port = getenv('PGPORT') ?: '5432';
                $dbname = getenv('PGDATABASE') ?: 'postgres';
                $user = getenv('PGUSER') ?: 'postgres';
                $password = getenv('PGPASSWORD') ?: '';
                
                self::$cont = new PDO(
                    "pgsql:host=$host;port=$port;dbname=$dbname",
                    $user,
                    $password
                );
                self::$cont->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            catch(PDOException $exception)
            {
                die($exception->getMessage());
            }
        }
        return self::$cont;
    }
    
    public static function desconectar()
    {
        self::$cont = null;
    }
}

?>
