package br.com.dio.board;

import java.time.LocalDateTime;

public class Card {
    private String titulo;
    private String descricao;
    private LocalDateTime dataCriacao;
    private boolean bloqueado;
    private String motivoBloqueio;

    public Card(String titulo, String descricao) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataCriacao = LocalDateTime.now();
        this.bloqueado = false;
        this.motivoBloqueio = null;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public boolean isBloqueado() {
        return bloqueado;
    }

    public void bloquear(String motivo) {
        this.bloqueado = true;
        this.motivoBloqueio = motivo;
    }

    public void desbloquear() {
        this.bloqueado = false;
        this.motivoBloqueio = null;
    }

    public String getMotivoBloqueio() {
        return motivoBloqueio;
    }

    @Override
    public String toString() {
        return "Card{" +
                "titulo='" + titulo + '\'' +
                ", descricao='" + descricao + '\'' +
                ", dataCriacao=" + dataCriacao +
                ", bloqueado=" + bloqueado +
                ", motivoBloqueio='" + motivoBloqueio + '\'' +
                '}';
    }
}