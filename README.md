# PB Transform
## Description
An easy way to transform a json object into a new schema


## Example

    const { transform } = require('./index.js');
    const start = async () => {
        let transformed = await transform(
            {
                id: 's1e1',
                name: 'Episode 1',
                active: true,
                releaseDate: '2021-10-31',
                details: {
                    summary: 'Summarized',
                    description: 'Long form description',
                    tags: ['comedy', 'drama', 'dramedy'],
                },
                group: {
                    category: 'Television',
                    subcategory: 'Episodic',
                },
                characters: [
                    {
                        name: 'Bob',
                        role: 'Person',
                    },
                    {
                        name: 'Mary',
                        role: 'Person',
                    },
                ],
            },
            {
                item: {
                    uuid: 'id',
                    id: 'id',
                    isActive: 'active',
                    releaseYear: 'releaseDate',
                    releaseMonth: 'releaseDate',
                    releaseDay: 'releaseDate',
                    tags: 'detailed.tags',
                    participants: {
                        related: 'id',
                        characters: 'characters',
                    },
                    category: {
                        primary: {
                            type: 'string',
                            category: 'group.category',
                        },
                        secondary: {
                            type: 'string',
                            category: 'group.subcategory',
                        },
                    },
                },
            },
            [
                {
                    transformation: (val) => {
                        return `${val} (new)`;
                    },
                    on: 'item.participants.related',
                },
                {
                    transformation: (val) => {
                        return val.split('-')[0];
                    },
                    on: 'item.releaseYear',
                },
                {
                    transformation: (val) => {
                        return val.split('-')[2];
                    },
                    on: 'item.releaseDay',
                },
                {
                    transformation: (val) => {
                        return val.split('-')[1];
                    },
                    on: 'item.releaseMonth',
                },
            ]
        );
        console.log(JSON.stringify(transformed, null, 4));
    };

    start();
