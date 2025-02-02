# :checkered_flag: O VERDE IMPORTA - Educação Ambiental

O projeto propõe o desenvolvimento de um site interativo para promover a conscientização ambiental, com foco em práticas sustentáveis e reciclagem. Destinado a comunidades locais, escolas e ONGs, o site oferecerá um Guia de Reciclagem com instruções detalhadas sobre separação de resíduos, Jogos Educativos interativos para ensinar sustentabilidade de forma lúdica e um Mapa de Coletas com pontos de coleta seletiva.


## :technologist: Membros da equipe

<ul>
  <li>Nícolas Ferreira Leite, 552425, Ciência da Computação</li>
  <li>Guilherme Lopes dos Santos, 556470, Ciência da Computação</li>
  <li>Évila Maria Vasconcelos de Araújo, 556241, Ciência da Computação</li>
</ul>

## :bulb: Objetivo Geral
Criar um site interativo para conscientizar a comunidade sobre práticas sustentáveis e reciclagem.

## :eyes: Público-Alvo
Comunidades locais, escolas e ONGs ambientais.

## :star2: Impacto Esperado
Promover a educação ambiental e práticas sustentáveis na comunidade.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

-   **Professor:**
    -   Criar e gerenciar postagens informativas sobre conteúdos ambientais.
    -   Responder dúvidas de usuários nos comentários.
    -   Fazer upload de materiais didáticos.
-   **Usuário:**
    -   Criar conta e realizar login no sistema.
    -   Comentar em postagens e interagir no fórum.
    -   Jogar os jogos educativos disponíveis.
    -   Visualizar materiais didáticos.
-   **Administrador:**
    -   Gerenciar postagens e comentários, podendo remover conteúdos impróprios.
    -   Gerenciar usuários, podendo banir contas se necessário.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação


-   **Jogos de conscientização ambiental:**
    -   Disponível para usuários logados.
-   **Fórum sobre educação ambiental:**
    -   Professores podem criar, visualizar, editar e  e admnistradores podem excluir postagens e comentários.
    -   Usuários podem interagir no fórum (comentários), enquanto professores publicam conteúdos educativos.
-   **Guia de reciclagem:**
    -   Disponível para todos os usuários sem necessidade de login.
    -   Administrador pode atualizar as informações do guia.
-   **Mapa de pontos de coleta seletiva:**
    -   Disponível para todos os usuários sem necessidade de login.
    -   Administração pode adicionar, editar ou remover pontos de coleta.
-   **Seção de materiais didáticos:**
    -   Professores podem adicionar materiais educativos para download.
    -   Usuários logados podem visualizar e baixar os materiais.
      
## :spiral_calendar: Entidades ou tabelas do sistema

-   **Usuário** (ID, Nome, Email, Senha, Tipo de Usuário)
-   **Administrador** (Herda de Usuário, Permissões Especiais)
-   **Professor** (Herda de Usuário, Permissão para Criar Postagens)
-   **Postagens** (ID, Título, Conteúdo, Autor, Data de Publicação)
-   **Comentários** (ID, Postagem, Usuário, Conteúdo, Data)
-   **Jogos** (ID, Nome, Descrição, Link, Data de Criação)
-   **Guias Didáticos** (ID, Título, Conteúdo, Autor, Data de Publicação)
-   **Mapa de Coletas** (ID, Localização, Descrição, Tipo de Resíduo Aceito)

----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.

**Backend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Entidade 1 | X |  X  |  | X |
| Entidade 2 | X |    |  X | X |
| Entidade 3 | X |    |  |  |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | api/entidade1/|
| POST | api/entidade2 |
