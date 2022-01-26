# iiko Access Token Refresh

Плагин [Insomnia.rest](https://insomnia.rest/ "Insomnia.rest") для поддержки в актуальном состоянии токена для [iiko api](https://ru.iiko.help/articles/#!api-documentations/api-iikocard "iiko api"). Был написан, чтобы не получать его постоянно руками и прописывать в Environment Variables.

Для работы необходимо [установить плагин](https://docs.insomnia.rest/insomnia/introduction-to-plugins "установить плагин"), а также создать **Environment Overrides** для папки с запросами, см. скриншот.

![iiko environment overrides](https://user-images.githubusercontent.com/9094917/151192143-a58ca773-057c-4e24-87c1-35f2ca4232e9.png "iiko environment overrides")

Заготовка: 

```json
{
	"USE_IIKO_PLUGIN": true,
	"ORG_ID": "here_is_iiko_organisation_id",
	"IIKO_LOGIN": "here_is_iiko_api_login",
	"IIKO_SECRET": "here_is_iiko_api_secret"
}
```

После этого можно отправлять запросы к разным методам API, параметр access_token будет автоматически подставляться к запросу. Поскольку токен выдается на 15 минут, токен и время его запроса сохраняется в папку плагина в файл **token.json**, при каждом запросе происходит проверка не истёк ли срок. Если истёк то получается новый токен, сохраняется в файл и делается запрос к API. Если нет, то просто делается запрос.