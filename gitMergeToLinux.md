# ¿Como fusionar el proyecto a la rama de linux, de la rama en la que estamos desarrollando sin afectar la configuracion del dockerfile?

### 1. Crea un nuevo branch temporal:

Antes de realizar cualquier cambio, asegúrate de estar en la rama ***docker_deployment_linux*** y crea un nuevo branch temporal:

```git

git checkout -b temporal_fusion

```

### 2. Realiza la fusión sin cambios en Dockerfile y docker-compose.yaml:

Realiza la fusión de development en este nuevo branch, pero evita la fusión de los archivos específicos. Puedes usar la opción ***--no-commit*** para evitar realizar automáticamente el commit:

```git

// Development es la rama de desarrollo
git merge --no-commit --no-ff development

```

Esto te permitirá realizar ajustes antes de confirmar la fusión.

### 3. Restaura los archivos específicos:

Restaura los archivos ***Dockerfile*** y ***docker-compose.yaml*** ***.env*** a su estado original en la rama ***docker_deployment_linux***. Esto cancelará los cambios en estos archivos realizados durante la fusión:

```git

git checkout docker_deployment_linux -- .env docker-compose-frontend.yaml

```

### 4. Confirma la fusión:

Ahora, puedes confirmar la fusión sin afectar los archivos específicos:

```git

git commit -m "Fusión de development en docker_deployment_linux (sin cambios en Dockerfile y docker-compose.yaml)"

```

# Fin