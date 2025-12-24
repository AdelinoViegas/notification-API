## Commits e Pull Requests

### Padrões de Commits

Este projeto adota o padrão **Conventional Commits** com o objetivo de manter um histórico claro, consistente e fácil de auditar.

#### Boas práticas

* Faça **commits pequenos, objetivos e descritivos**.
* Sempre que possível, cada commit deve representar **uma única mudança lógica**.
* Utilize mensagens no **modo imperativo** (ex.: “adiciona”, “corrige”, “remove”).
* Evite mensagens genéricas como “update”, “ajustes” ou “correções diversas”.

#### Exemplos de mensagens de commit

```yaml
add: adiciona validação de email no formulário        # inclusão de nova funcionalidade
update: ajusta visualização do relatório de serviços # alteração em código existente
fix: corrige erro no login quando a senha está vazia  # correção de bug
docs: atualiza instruções de instalação               # documentação ou descrição de fluxo
refact: simplifica lógica de autenticação             # refatoração sem alterar comportamento
test: adiciona testes para o componente de login      # testes automatizados
```

---

## Pull Requests

Cada Pull Request deve representar **uma funcionalidade ou objetivo específico**, sendo o agrupamento natural dos commits necessários para implementar ou modificar determinado recurso.

Para isso, deve ser utilizada **uma branch por funcionalidade**, garantindo que cada PR tenha um escopo bem definido e possa ser facilmente revisado.
As branches devem permanecer **sincronizadas com a `main`**, evitando divergências e conflitos desnecessários.

Branches não devem ter ciclos de vida longos, pois isso aumenta o risco de conflitos e dificulta o processo de integração.

#### Exemplo de criação de branch para um PR

```sh
git checkout main
git pull
git branch feat/transferencia_externa
git checkout feat/transferencia_externa
```

O nome da branch deve refletir claramente a funcionalidade ou objetivo proposto, sendo a **clareza o principal critério**.

Após a implementação e commits bem definidos, o Pull Request deve refletir com precisão a funcionalidade adicionada ou modificada, facilitando a revisão, validação e manutenção do código.