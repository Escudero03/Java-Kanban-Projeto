plugins {
    id("java")
}

group = "br.com.dio"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("mysql:mysql-connector-java:8.0.33")
    implementation("org.liquibase:liquibase-core:4.29.1")
    implementation("org.projectlombok:lombok:1.18.32") // Adicione esta linha
    annotationProcessor("org.projectlombok:lombok:1.18.32") // Adicione esta linha
}

tasks.test {
    useJUnitPlatform()
}