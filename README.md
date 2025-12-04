-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.auth_group (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL UNIQUE,
  CONSTRAINT auth_group_pkey PRIMARY KEY (id)
);
CREATE TABLE public.auth_group_permissions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  group_id integer NOT NULL,
  permission_id integer NOT NULL,
  CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id),
  CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id)
);
CREATE TABLE public.auth_permission (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  content_type_id integer NOT NULL,
  codename character varying NOT NULL,
  CONSTRAINT auth_permission_pkey PRIMARY KEY (id),
  CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id)
);
CREATE TABLE public.auth_user (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  password character varying NOT NULL,
  last_login timestamp with time zone,
  is_superuser boolean NOT NULL,
  username character varying NOT NULL UNIQUE,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL,
  is_staff boolean NOT NULL,
  is_active boolean NOT NULL,
  date_joined timestamp with time zone NOT NULL,
  CONSTRAINT auth_user_pkey PRIMARY KEY (id)
);
CREATE TABLE public.auth_user_groups (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id integer NOT NULL,
  group_id integer NOT NULL,
  CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id),
  CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id),
  CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id)
);
CREATE TABLE public.auth_user_user_permissions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id integer NOT NULL,
  permission_id integer NOT NULL,
  CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id),
  CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id)
);
CREATE TABLE public.django_admin_log (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  action_time timestamp with time zone NOT NULL,
  object_id text,
  object_repr character varying NOT NULL,
  action_flag smallint NOT NULL CHECK (action_flag >= 0),
  change_message text NOT NULL,
  content_type_id integer,
  user_id integer NOT NULL,
  CONSTRAINT django_admin_log_pkey PRIMARY KEY (id),
  CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id),
  CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id)
);
CREATE TABLE public.django_content_type (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  app_label character varying NOT NULL,
  model character varying NOT NULL,
  CONSTRAINT django_content_type_pkey PRIMARY KEY (id)
);
CREATE TABLE public.django_migrations (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  app character varying NOT NULL,
  name character varying NOT NULL,
  applied timestamp with time zone NOT NULL,
  CONSTRAINT django_migrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.django_session (
  session_key character varying NOT NULL,
  session_data text NOT NULL,
  expire_date timestamp with time zone NOT NULL,
  CONSTRAINT django_session_pkey PRIMARY KEY (session_key)
);
CREATE TABLE public.imagenes_proyecto (
  id integer NOT NULL DEFAULT nextval('imagenes_proyecto_id_seq'::regclass),
  proyecto_id integer NOT NULL,
  url_imagen character varying NOT NULL,
  orden integer DEFAULT 0,
  descripcion_alt character varying,
  CONSTRAINT imagenes_proyecto_pkey PRIMARY KEY (id),
  CONSTRAINT imagenes_proyecto_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id)
);
CREATE TABLE public.mensajes (
  id integer NOT NULL DEFAULT nextval('mensajes_id_seq'::regclass),
  nombre character varying NOT NULL,
  email character varying NOT NULL,
  mensaje text NOT NULL,
  fecha_envio timestamp without time zone DEFAULT now(),
  leido boolean DEFAULT false,
  CONSTRAINT mensajes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.portfolio_contact (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  email character varying NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL,
  CONSTRAINT portfolio_contact_pkey PRIMARY KEY (id)
);
CREATE TABLE public.portfolio_project (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title character varying NOT NULL,
  description text NOT NULL,
  link character varying,
  technologies jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL,
  status character varying NOT NULL,
  CONSTRAINT portfolio_project_pkey PRIMARY KEY (id)
);
CREATE TABLE public.portfolio_projectimage (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  image character varying NOT NULL,
  project_id bigint NOT NULL,
  CONSTRAINT portfolio_projectimage_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_projectima_project_id_9276d60f_fk_portfolio FOREIGN KEY (project_id) REFERENCES public.portfolio_project(id)
);
CREATE TABLE public.portfolio_skill (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  category character varying NOT NULL,
  proficiency integer NOT NULL,
  CONSTRAINT portfolio_skill_pkey PRIMARY KEY (id)
);
CREATE TABLE public.proyectos (
  id integer NOT NULL DEFAULT nextval('proyectos_id_seq'::regclass),
  titulo character varying NOT NULL,
  descripcion text,
  estado character varying DEFAULT 'EN DESARROLLO'::character varying CHECK (estado::text = ANY (ARRAY['COMPLETADO'::character varying, 'EN DESARROLLO'::character varying, 'ARCHIVADO'::character varying]::text[])),
  tecnologias ARRAY DEFAULT '{}'::character varying[],
  url_demo character varying,
  url_codigo character varying,
  fecha_creacion timestamp without time zone DEFAULT now(),
  fecha_actualizacion timestamp without time zone DEFAULT now(),
  CONSTRAINT proyectos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.visitas (
  id integer NOT NULL DEFAULT nextval('visitas_id_seq'::regclass),
  url_visitada character varying NOT NULL,
  ip_usuario inet,
  timestamp timestamp without time zone DEFAULT now(),
  CONSTRAINT visitas_pkey PRIMARY KEY (id)
);