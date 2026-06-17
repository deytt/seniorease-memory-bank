# Product Context — SeniorEase

---

## Por que o SeniorEase existe

Plataformas digitais modernas são projetadas para usuários jovens e tecnicamente familiarizados. Interfaces densas, fontes pequenas, botões minúsculos e fluxos complexos criam barreiras para pessoas idosas, que muitas vezes desistem de usar tecnologia por medo de errar ou por não conseguir enxergar o que está na tela.

A FIAP Inclusive identificou essa lacuna em ambientes acadêmicos e profissionais: idosos matriculados em cursos ou inseridos no mercado de trabalho precisam usar plataformas digitais — mas as plataformas não foram pensadas para eles.

O **SeniorEase** resolve isso ao colocar a acessibilidade no centro do design, não como uma feature adicional, mas como fundação de cada decisão de produto e código.

---

## Persona principal

**Nome:** Margaret (nome fictício representativo)
**Idade:** 68 anos
**Contexto:** Aluna de pós-graduação ou profissional em reinserção no mercado

**Características:**
- Usa smartphone há alguns anos, mas ainda hesita ao navegar em apps novos
- Precisa de óculos para leitura — fontes pequenas são uma barreira real
- Tem medo de apertar o botão errado e "estragar algo"
- Aprecia quando o app confirma que o que ela fez deu certo
- Prefere clareza a completude: prefere ver menos opções do que se sentir perdida
- Usa o app principalmente pela manhã para organizar o dia

**Frustrações com apps atuais:**
- Não sabe onde está dentro do app após algumas navegações
- Botões pequenos causam toques acidentais em elementos adjacentes
- Mensagens de erro são técnicas e assustadoras
- Não sabe se uma ação "funcionou" porque não houve feedback
- Textos longos e densos a fazem abandonar a tarefa

**O que ela precisa:**
- Saber exatamente onde está e o que pode fazer
- Uma ação principal por tela — sem sobrecarga de decisão
- Confirmação visual clara após cada ação
- Poder desfazer ou sair de qualquer situação sem consequências irreversíveis
- Linguagem simples, sem jargão técnico

---

## Objetivos do produto

1. **Autonomia** — o idoso deve conseguir usar o app de forma independente, sem precisar pedir ajuda
2. **Confiança** — o app deve transmitir segurança: o usuário nunca deve sentir que vai "quebrar" algo
3. **Inclusão digital** — reduzir a distância entre o idoso e o ambiente digital acadêmico/profissional
4. **Consistência** — comportamento previsível: a mesma ação sempre produz o mesmo resultado

---

## Princípios de produto

Estes princípios guiam todas as decisões de design e implementação. Quando houver dúvida sobre como implementar algo, consulte estes princípios:

### 1. Clareza acima de completude
Menos é mais. Mostrar 3 opções claras é melhor do que 10 opções completas. O Modo Básico existe para reduzir o número de elementos visíveis na tela.

### 2. Uma ação principal por tela
Cada tela deve ter um objetivo claro e um botão primário óbvio. Nunca dois CTAs de peso igual competindo pela atenção do usuário.

### 3. Feedback imediato e positivo
Toda ação do usuário deve gerar resposta visual imediata. Ações bem-sucedidas devem ser celebradas (animação Lottie ao concluir tarefa). Erros devem ser explicados em linguagem simples e com sugestão de correção.

### 4. Nunca deixe o usuário preso
Toda tela deve ter uma saída clara (botão Voltar, botão Cancelar, botão X). Fluxos guiados devem ter "Sair do modo guiado" sempre acessível. O usuário nunca deve se sentir encurralado.

### 5. Confirmação antes do irreversível
Antes de deletar uma tarefa ou realizar qualquer ação que não possa ser desfeita, sempre exibir um modal de confirmação com linguagem clara: "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."

### 6. Linguagem simples e humana
Evitar jargão técnico. Preferir "Sua tarefa foi salva com sucesso!" a "Operação concluída". Preferir "Algo deu errado, tente novamente" a "Erro 500 — Internal Server Error".

### 7. Adaptabilidade real
Os ajustes de fonte, contraste e espaçamento devem ser **funcionais**, não apenas visuais. Ao aumentar o tamanho da fonte, o layout deve se adaptar sem quebrar. O contraste alto deve realmente atingir a razão mínima de 4.5:1 (WCAG AA).

---

## O que o SeniorEase NÃO é

- Não é um app de saúde (não monitora sinais vitais, não gerencia medicamentos diretamente)
- Não é uma rede social (não tem feed, não tem posts, não tem seguidores)
- Não é um substituto para um cuidador (é uma ferramenta de autonomia, não de dependência)
- Não é voltado para idosos com comprometimento cognitivo severo (é para usuários com independência funcional que precisam de apoio digital)
