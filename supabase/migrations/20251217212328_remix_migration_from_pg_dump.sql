CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: essays; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.essays (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    score integer,
    feedback jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    type text DEFAULT 'study'::text,
    location text,
    recurrence text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: exam_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    total_score numeric(5,2) NOT NULL,
    max_score numeric(5,2) DEFAULT 100,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: flashcards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flashcards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    front text NOT NULL,
    back text NOT NULL,
    next_review date DEFAULT CURRENT_DATE,
    "interval" integer DEFAULT 1,
    ease_factor numeric DEFAULT 2.5,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    target_course text,
    current_year text,
    streak_count integer DEFAULT 0,
    last_activity_date date,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_pro boolean DEFAULT false,
    xp_points integer DEFAULT 0
);


--
-- Name: questions_pool; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions_pool (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subject text NOT NULL,
    topic text,
    difficulty text DEFAULT 'medium'::text,
    content jsonb NOT NULL,
    origin text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: saved_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    content jsonb NOT NULL,
    subject text NOT NULL,
    topic text,
    is_correct boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: study_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    subject text NOT NULL,
    topic text,
    is_done boolean DEFAULT false,
    date date DEFAULT CURRENT_DATE,
    duration_minutes integer DEFAULT 60,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: essays essays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.essays
    ADD CONSTRAINT essays_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: exam_results exam_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_results
    ADD CONSTRAINT exam_results_pkey PRIMARY KEY (id);


--
-- Name: flashcards flashcards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT flashcards_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: questions_pool questions_pool_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions_pool
    ADD CONSTRAINT questions_pool_pkey PRIMARY KEY (id);


--
-- Name: saved_questions saved_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_questions
    ADD CONSTRAINT saved_questions_pkey PRIMARY KEY (id);


--
-- Name: study_tasks study_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_tasks
    ADD CONSTRAINT study_tasks_pkey PRIMARY KEY (id);


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: events events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exam_results exam_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_results
    ADD CONSTRAINT exam_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: questions_pool questions_pool_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions_pool
    ADD CONSTRAINT questions_pool_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: saved_questions saved_questions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_questions
    ADD CONSTRAINT saved_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: questions_pool Anyone can view questions pool; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view questions pool" ON public.questions_pool FOR SELECT USING (true);


--
-- Name: questions_pool Authenticated users can insert questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert questions" ON public.questions_pool FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: essays Users can delete own essays; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own essays" ON public.essays FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: events Users can delete own events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own events" ON public.events FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: exam_results Users can delete own exam results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own exam results" ON public.exam_results FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: flashcards Users can delete own flashcards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own flashcards" ON public.flashcards FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: saved_questions Users can delete own saved questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own saved questions" ON public.saved_questions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: study_tasks Users can delete own study_tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own study_tasks" ON public.study_tasks FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: essays Users can insert own essays; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own essays" ON public.essays FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: events Users can insert own events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own events" ON public.events FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: exam_results Users can insert own exam results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own exam results" ON public.exam_results FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: flashcards Users can insert own flashcards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own flashcards" ON public.flashcards FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: saved_questions Users can insert own saved questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own saved questions" ON public.saved_questions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: study_tasks Users can insert own study_tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own study_tasks" ON public.study_tasks FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: essays Users can update own essays; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own essays" ON public.essays FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: events Users can update own events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own events" ON public.events FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: exam_results Users can update own exam results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own exam results" ON public.exam_results FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: flashcards Users can update own flashcards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own flashcards" ON public.flashcards FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: study_tasks Users can update own study_tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own study_tasks" ON public.study_tasks FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: essays Users can view own essays; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own essays" ON public.essays FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: events Users can view own events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own events" ON public.events FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: exam_results Users can view own exam results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own exam results" ON public.exam_results FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: flashcards Users can view own flashcards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own flashcards" ON public.flashcards FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: saved_questions Users can view own saved questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own saved questions" ON public.saved_questions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: study_tasks Users can view own study_tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own study_tasks" ON public.study_tasks FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: essays; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: exam_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

--
-- Name: flashcards; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: questions_pool; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.questions_pool ENABLE ROW LEVEL SECURITY;

--
-- Name: saved_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.saved_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: study_tasks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


