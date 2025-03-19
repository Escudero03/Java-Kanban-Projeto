package br.com.dio.board;        
import java.sql.Connection;      
import java.sql.DriverManager;   
import java.sql.SQLException;    
public class DatabaseConnection {
    // Certifique-se de que essas informações estão corretas
    private static final String URL = "jdbc:mysql://localhost:3306/boarddb?createDatabaseIfNotExist=true&useSSL=false";
    private static final String USER = "root"; // Seu usuário MySQL
    private static final String PASSWORD = ""; // Sua senha MySQL - deixe vazio se não tiver senha
    
    public static Connection getConnection() throws SQLException {
        try {
            // Carrega o driver explicitamente
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            System.err.println("Driver MySQL não encontrado: " + e.getMessage());
            throw new SQLException("Driver não encontrado", e);
        }
    }
}