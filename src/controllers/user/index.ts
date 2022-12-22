import { Request, Response } from 'express';
import database from '../../config/db/db';
import bcrypt from 'bcrypt';
import { IRequest } from '../../types';

export const resetPassword = async (req: IRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Missing new or old password' });

    try {
        database.all('SELECT password, id FROM users WHERE id = ?', [req.user.user_id], async (err, row) => {
            if (err)
                return res.status(400).json({ message: 'User not found' });
            if (row.length > 0) {
                const user = row[0];
                const isMatched = await bcrypt.compare(oldPassword, user.password);
                if (isMatched) {
                    const newHashedPassword = await bcrypt.hash(newPassword, 10);
                    await database.run('UPDATE users SET password = ? WHERE login_name = ?', [newHashedPassword,'developer'], (err) => {
                        if (err) return res.status(400).json({ message: err.message });
                        res.status(200).json({ message: 'Password changed.' });
                    });
                } else {
                    res.status(400).json({ message: 'Not matched passwords.' });
                }
            }
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};


export const getUserInfo =  (req: IRequest, res: Response) => {    
    try {
         database.get('SELECT login_name, user_id, roles_name FROM users_roles INNER JOIN users WHERE user_id = id AND user_id = ?',
         [req.user.user_id],
         (err, row) => {
            if (err) return res.status(401).json({ error: err.message });            
            if (row) {                
                return res.status(200).send([{ id: row.user_id, username: row.login_name, role: row.roles_name }]);
            } else {
                return res.status(401).json({ message: 'User not found.' });
            }
         }
          );
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }

};

export const setUserConfig = async (req: Request, res: Response) => {
    const { role, route, updatedRoutes } = req.body;        
    const promises = updatedRoutes.map((u: any) => {
        return new Promise((resolve) => {
            database.run(`UPDATE sub_routes SET ${role} = ? WHERE route_id = (SELECT route_id FROM routes WHERE route_name = ?) AND name = ?`, 
            [u.checked, route, u.id],
            (err: any) => {
                if(!err) resolve(u.checked);
            }
            );
        });
    });
    Promise.all(promises).then((res) => {
        console.log(res);
    });
    return res.status(200).send(req.body || '21321');

};

export const getUserConfig = async (req: Request, res: Response) => {
    const userRole = req.params.userRole;
    if (!userRole) return res.status(400).json({ message: 'User data not provided' });
    
    const formatRows = (rows: any) => {

        const convertIdToTitle = (name: string) => {
            switch (name) {
                case 'shutdown/reboot':
                    return 'Shutdown / reboot';
                    break;
                case 'ip_address':
                    return 'IP Address';
                    break;
                case 'port_fowarding':
                    return 'Port Fowarding';
                    break;
                case 'users_status':
                    return 'Users Status';
                    break;
                case 'users_database':
                    return 'Users Database';
                    break;
                case 'imei':
                    return 'IMEI Restricted List';
                    break;
                case 'sensing':
                    return 'Sensing & Evasion';
                    break;
                case 'ping_test':
                    return 'Ping Test';
                    break;
                case 'throughput_test':
                    return 'Throughput test';
                    break;
                case 'epc_enodeb':
                    return 'EPC & eNodeB';
                    break;
                case 'developer_privileges': 
                    return 'Developer privileges';
                    break;   
                     
                case 'users_privileges': 
                    return 'Users privileges';
                    break;   

                default:
                    return name.charAt(0).toUpperCase() + name.slice(1);
                    break;
            }
        };

        const config: any = [
            { id:'system', title: 'System' , childrens: [] },
            { id:'network', title: 'Network', childrens: [] },
            { id:'enodeb', title: 'eNodeB' , childrens: [] },
            { id:'serial', title: 'Serial' , childrens: [] },
            { id:'backhaul', title: 'Backhaul' , childrens: [] },
            { id:'gps', title: 'GPS' , childrens: [] },
            { id:'diagnostic', title: 'Diagnostic' , childrens: [] },
            { id:'logs', title: 'Logs' , childrens: [] },
            { id:'privileges', title: 'Privileges' , childrens: [] }];

         config.forEach((row: any) => {
             rows.forEach((subRoute: any) => {
                if (subRoute.route_name === row.id) {
                    row.childrens.push({ title: convertIdToTitle(subRoute.name), id: subRoute.name, checked: subRoute[userRole] === 1 ? true : false });
                }
             });
        });

        return config;
    };


    try {
        database.all(`SELECT routes.route_name, sub_routes.name, sub_routes.${userRole.toLowerCase()} 
        FROM routes INNER JOIN sub_routes ON routes.route_id = sub_routes.route_id`,
        [],
        (err, rows) => {
            if (err) return res.status(400).json({ message: 'Cannot send config.' });
            return res.send(formatRows(rows));
        });
    } catch (error) {
        return res.status(400).json({ message: 'Error' });
    }
    
};

// export const resetAnotherPassword = async (req: Request, res: Response) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token === null) res.status(401).json({ error: 'Null token' });
//     if (token) {
//         const decode = jwt.decode(token);
//         console.log(decode);
//     } else {
//         console.log('sadasd');
//     }
// };